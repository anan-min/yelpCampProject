const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    // validateCampground,
    campgrounds.createCampground
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(campgrounds.renderShowPage))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  );

module.exports = router;
