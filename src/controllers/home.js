"use strict";

/**
 * Renders the home page
 * 
 * @endpoint {GET} /
 * @returns {undefined}
 */
const getHomePage = (req, res) => {
  const data = {
    bUserIsAuthenticated: req.session.bUserIsAuthenticated,
    objUser: req.session.objUser
  }

  res.render("home/home.ejs", data);
}

module.exports = {
  getHomePage: getHomePage
}