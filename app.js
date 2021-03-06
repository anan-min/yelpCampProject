if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// console.log(process.env);
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const Campground = require("./models/campground");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "default secret";
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: "secret",
    touchAfter: 24 * 60 * 60,
  }),
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const { securityPolicy } = require("./public/security");
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet.contentSecurityPolicy(securityPolicy));
/**
 * passport
 * - sessoin should come before passport.sesion
 * - authenticate and deserializeUser are added auto by passport
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("home", { campgrounds });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

/// error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  //   res.send("something went wrong");
  res.status(statusCode).render("error", { err });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port 3000 ${port}`);
});
