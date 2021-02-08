const express = require("express");
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession);

const app = express();
const store = new MongoStore({
  url: "mongodb://localhost:27017/login_system_v1",
  collection: "sessions",
  autoRemove: 'interval',
  autoRemoveInterval: 10 // In minutes. Default
});

app.use(expressSession({ 
  secret: "keyboard cats", 
  cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000 // In milliseconds. 5 Days in total.
  }, 
  httpOnly: true, 
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: store, 
}), (req, res, next) => {
  // Initialise default variables on the session object
  if (typeof req.session != "undefined") {
    if (typeof req.session.initialised === "undefined") {
      req.session.initialised = true;
      req.session.pageViews = 0;
    }
  }
  next();
});

app.get("/", (req, res) => {
  // If there is a session established
  if (typeof req.session != "undefined") { 
    console.log("kur");
    req.session.pageViews++;
  }
  console.log(req.session);
  res.send("HOME");
});

app.get("/login", (req, res) => {
  req.session.bUserIsAuthenticated = true;
  res.send("Login Successful");
});

app.listen(3000, () => {
  console.log(`Server is listening on http://localhost:3000`);
})