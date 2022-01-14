const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  img: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    },
  ],
});

// Campground -> campgrounds
// use db_name db.collection_name.find()
module.exports = mongoose.model("Campground", CampgroundSchema);
