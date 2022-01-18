const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

/**
 * render campground index which shows all campgrounds available
 */
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

/**
 * render page for creating new campground
 */
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

/**
 * render show page of the campground with the specific id
 */
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground does not exist");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

/**
 * render the edit page for the campground for the specific id if exist
 */
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground does not exist");
      res.redirect(" /campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

/**
 * validat and create campground from the form data submitted
 */
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully create new campground");
    res.redirect(`campgrounds/${campground._id}`);
  })
);

/**
 * validate and update campground from the edit form submitted
 */
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully update  campground");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

/**
 * delete campground with specific id
 */
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// /// error handling
// router.use((err, req, res, next) => {
//   const { statusCode = 500, message = "something went wrong" } = err;
//   //   res.send("something went wrong");
//   res.status(statusCode).render("error", { err });
// });

module.exports = router;
