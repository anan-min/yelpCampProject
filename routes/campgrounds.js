const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Campground does not exist");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground does not exist");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully create new campground");
    res.redirect(`campgrounds/${campground._id}`);
  })
);

router.put(
  "/:id",
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

router.delete(
  "/:id",
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
