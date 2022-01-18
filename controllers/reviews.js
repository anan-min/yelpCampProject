const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await newReview.save();
  await campground.save();
  req.flash("success", "review created");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
  // console.log("Delete request recieved");
  // should I add the mongoose middleware there
  // or I just simply remove the data
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { revies: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
};
