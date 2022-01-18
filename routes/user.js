const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const flash = require("connect-flash/lib/flash");
const passport = require("passport");

/**
 * get form for user registeration
 */
router.get("/register", (req, res) => {
  res.render("users/register");
});

/**
 * create a user from form data
 */
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to yelpcamp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

/**
 * get login form
 */
router.get("/login", (req, res) => {
  res.render("users/login");
});

/**
 * send login request with username ans password to the server
 */
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  }
);

/**
 * log user out from the system
 */

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
});

module.exports = router;
