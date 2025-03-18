const express = require("express");
const {
  getSeasonRatings,
  rateSeason,
  deleteSeasonRating,
} = require("../controllers/seasonRatingController");

const router = express.Router();

// Get all season ratings for a user
router.get("/:userId", getSeasonRatings);

// Create or update a season rating
router.post("/rateSeason", rateSeason);

// Delete a season rating
router.post("/delSeason", deleteSeasonRating);

module.exports = router;