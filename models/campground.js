const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CampgroundSchema = new Schema({
    title: String,
    price: String, 
    description: String, 
    location: String
})

// Campground -> campgrounds
// use db_name db.collection_name.find() 
module.exports = mongoose.model('Campground',CampgroundSchema);