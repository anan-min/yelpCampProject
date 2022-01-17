const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");
const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // create review from the form and add to the review db
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "review created");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // console.log("Delete request recieved");
    // should I add the mongoose middleware there
    // or I just simply remove the data
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { revies: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
