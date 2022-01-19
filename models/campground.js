const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const geometrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: geometrySchema,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Campground -> campgrounds
// use db_name db.collection_name.find()
module.exports = mongoose.model("Campground", CampgroundSchema);
