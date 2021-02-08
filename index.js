const express = require("express");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

const config = require("./src/config/config.js");
const mongodb = require("./src/config/mongodb.js");
const authRoutes = require("./src/routes/auth.js");

const app = express();
const store = new MongoStore({
  url: config.DB_CONNECTION_URL,
  collection: "sessions",
  autoRemove: 'interval',
  autoRemoveInterval: 10 // In minutes. Default
});
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(expressSession({ 
  secret: "keyboard cats", 
  cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000 // In milliseconds. 5 Days in total.
  }, 
  httpOnly: true, 
  saveUninitialized: false, // don't create session until something is stored
  resave: false, //don't save session if unmodified
  store: store, 
}), (req, res, next) => {
  // Initialise default variables on the session object
  if (typeof req.session != "undefined") {
    if (typeof req.session.initialisedSession === "undefined") {
      req.session.initialisedSession = true;
      req.session.bUserIsAuthenticated = false;
      req.session.pageViews = 0;
    }
  }
  next();
});

app.use(authRoutes.routes);

app.get("/", (req, res) => {
  req.session.pageViews++;
  console.log(req.session);

  var html = "Hello, ";
  if (!req.session.bUserIsAuthenticated) {
    html += "Guest !";
  } else {
    html += req.session.username + "!";
  }

  res.send(`
    <h1>HOME PAGE</h1>
    <br>
    <a href="/login">login page</a>
    <a href="/register">register page</a>
    ${html}
  `);

});

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

})()