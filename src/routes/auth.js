const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.js");

router.get("/auth/login", authController.getLoginPage);
router.get("/auth/register", authController.getRegisterPage);
router.get("/auth/logout", authController.getLogoutPage);
router.post("/auth/login", express.urlencoded({ extended: false }), authController.postLogin);
router.post("/auth/register", express.urlencoded({ extended: false }), authController.postRegister);
router.post("/auth/logout", authController.postLogout);

module.exports = {
  routes: router,
};