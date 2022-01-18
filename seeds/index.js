const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const numberOfCities = 1035;
const numberOfNames = 18;

// These option is already default at mongoose 6
// {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    await randomCamp().save();
  }
};

function randomCamp() {
  const randomLocation = sample(cities);
  const randomPrice = Math.floor(Math.random() * 20) + 10;
  const newCamp = new Campground({
    location: `${randomLocation.city}, ${randomLocation.state}`,
    title: `${sample(descriptors)} ${sample(places)}`,
    img: "https://source.unsplash.com/collection/483251",
    author: "61e634cc37c28063472ed11e",
    description: `  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam ea iusto,
    laborum odit minus cumque delectus sint similique excepturi optio ullam eius
    enim qui voluptatem quaerat tempora atque sit. Animi. Laborum sed
    reprehenderit ullam labore numquam aliquid corrupti consectetur ea illum
    doloremque harum officia nesciunt, adipisci, placeat incidunt quos
    exercitationem similique recusandae, a enim quis maxime. Modi labore ad
    maxime!`,
    price: randomPrice,
  });
  return newCamp;
}

seedDb();
