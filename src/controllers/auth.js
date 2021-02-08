"use strict";

const getLoginPage = (req, res) => {
  const data = {
    pageTitle: "Login",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/login.ejs", data);
}

const getRegisterPage = (req, res) => {
  const data = {
    pageTitle: "Register",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/register.ejs", data);
}

const postLogin = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
  
    req.session.bUserIsAuthenticated = true;
    req.session.username = username;
  
    res.send("Login Successful");
}

module.exports = {
  getLoginPage: getLoginPage,
  getRegisterPage: getRegisterPage,
  postLogin: postLogin
}