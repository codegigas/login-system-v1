const express = require("express");
const cookieParser = require('cookie-parser')
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

const config = require("./src/config/config.js");
const mongodb = require("./src/config/mongodb.js");
const authRoutes = require("./src/routes/auth.js");
const homeRoutes = require('./src/routes/home.js');

const app = express();
const store = new MongoStore({
  url: config.DB_CONNECTION_URL,
  collection: "sessions",
  autoRemove: 'interval',
  autoRemoveInterval: 10 // In minutes. Default
});
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(cookieParser(config.COOKIE_PARSER_SECRET));
app.use(expressSession({ 
  secret: config.EXPRESS_SESSION_SECRET, 
  saveUninitialized: false, // don't create session until something is stored
  resave: false, //don't save session if unmodified
  store: store, 
  cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000, // In milliseconds. 5 Days in total.
    httpOnly: true
  }, 
}), (req, res, next) => {
  // Initialise default variables on the session object
    if (typeof req.session.initialisedSession === "undefined") {
      req.session.initialisedSession = true;
      req.session.bUserIsAuthenticated = false;
    }
  next();
});

app.use(authRoutes.routes);
app.use(homeRoutes.routes);

(async () => {
  try {
    await mongodb.connect();
    app.listen(config.PORT, () => {
      console.log(`Server is listening on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
    await mongodb.disconnect();
  }

})();