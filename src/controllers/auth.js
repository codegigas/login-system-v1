"use strict";

const User = require("../models/user.js");

/**
 * Renders the login page
 * 
 * @endpoint {GET} /auth/login
 * @returns {undefined}
 */
const getLoginPage = (req, res) => {
  const data = {
    pageTitle: "Login",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/login.ejs", data);
}

/**
 * Renders the register page
 * 
 * @endpoint {GET} /auth/register
 * @returns {undefined}
 */
const getRegisterPage = (req, res) => {
  const data = {
    pageTitle: "Register",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated
  }
  res.render("auth/register.ejs", data);
}

/**
 * Renders the logout page
 * 
 * @endpoint {GET} /auth/logout
 * @returns {undefined}
 */
const getLogoutPage = (req, res) => {
  const data = {
    pageTitle: "Logout",
    bUserIsAuthenticated: req.session.bUserIsAuthenticated,
    objUser: req.session.objUser
  }
  res.render("auth/logout", data);
}

/**
 * Login a user
 * 
 * @endpoint {POST} /auth/login
 * @returns {undefined}
 */
const postLogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  var user = null;
  try {
    user = await User.getUserByUsername(username);
  } catch (err) {
    console.log(err);
    res.render("home.ejs");
    return;
  }

  if (user == null) {
    const data = {
      objRegisterErrors: {
        bUserDoesNotExist: true
      }
    }
    res.render("auth/login.ejs", data);
    return;
  }

  const passwordSalt = user.passwordSalt;
  const passwordHash = user.passwordHash;
  const currentPasswordHash = User.generateHash(password, passwordSalt);

  if (passwordHash != currentPasswordHash) {
    const data = {
      objRegisterErrors: {
        bPasswordIsIncorrect: true
      }
    }
    res.render("auth/login.ejs", data);
    return;
  }

  req.session.bUserIsAuthenticated = true;
  req.session.objUser = {
    user_id: user._id,
    username: user.username,
    email: user.email
  };
  req.session.save((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
}

/**
 * Registers a new user
 * 
 * @endpoint {POST} /auth/register
 * @returns {undefined}
 */
const postRegister = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  // Step 1. Input Data Validation
  // Step 2. Database Data Validation

  await User.bCheckIfUsernameIsAvaliableAsync(username);

  var results = null;
  try {
    results = await Promise.all([
      User.bCheckIfUsernameIsAvaliableAsync(username),
      User.bCheckIfEmailIsAvaliableAsync(email),
    ]);
  } catch (err) {
    console.log(err);
    res.render("home.ejs");
    return;
  }

  const bUsernameIsAvaliable = results[0];
  const bEmailIsAvaliable = results[1];

  if (bUsernameIsAvaliable == false || bEmailIsAvaliable == false) {
    const data = {
      bUserIsAuthenticated: req.session.bUserIsAuthenticated,
      objRegisterForm: {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        email: email,
      },
      objRegisterErrors: {
        bUsernameIsAvaliable: bUsernameIsAvaliable,
        bEmailIsAvaliable: bEmailIsAvaliable
      }
    }
    res.render("auth/register.ejs", data);
    return;
  }

  // Step 3. User Creation
  const passwordSalt = User.generateSalt();
  const passwordHash = User.generateHash(password, passwordSalt);
  
  const user = {
    username: username,
    email: email,
    passwordSalt: passwordSalt,
    passwordHash: passwordHash
  }

  await User.insertOneAsync(user);

  var data = {
    bUserIsAuthenticated: req.session.bUserIsAuthenticated,
  }
  res.render("home.ejs", data);
  
}

/**
 * Destroys the current `req.session` object. Afterwards you will be instantly given a new one, since you make a new request.
 * 
 * @endpoint {POST} /auth/logout
 * @returns {undefined}
 */
const postLogout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
}

module.exports = {
  getLoginPage: getLoginPage,
  getRegisterPage: getRegisterPage,
  getLogoutPage: getLogoutPage,
  postLogin: postLogin,
  postRegister: postRegister,
  postLogout: postLogout
}