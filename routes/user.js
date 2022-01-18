const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

/**
 * get form for user registeration
 */
router.get("/register", users.renderRegisterForm);

/**
 * create a user from form data
 */
router.post("/register", catchAsync(users.registerUser));

/**
 * get login form
 */
router.get("/login", users.renderLoginForm);

/**
 * send login request with username ans password to the server
 */
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

/**
 * log user out from the system
 */

router.get("/logout", users.logoutUser);

module.exports = router;
