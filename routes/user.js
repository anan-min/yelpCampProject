const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

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
    res.send(req.body);
  })
);

module.exports = router;
