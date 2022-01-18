const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const campgrounds = require("../controllers/campgrounds");
/**
 * render campground index which shows all campgrounds available
 */
router.get("/", catchAsync(campgrounds.index));

/**
 * render page for creating new campground
 */
router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

/**
 * render show page of the campground with the specific id
 */
router.get("/:id", catchAsync(campgrounds.renderShowPage));

/**
 * render the edit page for the campground for the specific id if exist
 */
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

/**
 * validat and create campground from the form data submitted
 */
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

/**
 * validate and update campground from the edit form submitted
 */
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

/**
 * delete campground with specific id
 */
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

// /// error handling
// router.use((err, req, res, next) => {
//   const { statusCode = 500, message = "something went wrong" } = err;
//   //   res.send("something went wrong");
//   res.status(statusCode).render("error", { err });
// });

module.exports = router;
