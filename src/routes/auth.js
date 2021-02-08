const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

router.post("/login", express.urlencoded({ extended: false }), (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  req.session.bUserIsAuthenticated = true;
  req.session.username = username;

  res.send("Login Successful");
});

module.exports = {
  routes: router,
};