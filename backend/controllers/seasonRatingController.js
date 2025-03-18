const SeasonRating = require("../models/SeasonRating");
const User = require("../models/User");
const Review = require("../models/Review");
const Activity = require("../models/Activity");
const axios = require("axios");

// Get all season ratings for a user
const getSeasonRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const seasonRatings = await SeasonRating.find({ user: userId }).lean();
    if (!seasonRatings) {
      return res.status(404).json({ message: "Season ratings not found" });
    }
    res.status(200).json(seasonRatings);
  } catch (error) {
    console.error("Error fetching season ratings:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Create or update a season rating for a user
const rateSeason = async (req, res) => {
  try {
    const {
      userId,
      showId,
      seasonNumber,
      rating,
      comment,
      status,
      episodes,
      reviewUserName,
      hours,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    const showDetails = tmdbResponse.data;

    const seasonRating = await SeasonRating.findOneAndUpdate(
      { user: userId, show: showId, season: seasonNumber },
      {
        $set: {
          rating,
          comment,
          status,
          episodes,
          hours,
        },
      },
      { new: true, upsert: true }
    );

    const review = await Review.findOne({ username: reviewUserName, showId });

    const newActivity = new Activity({
      user: userId,
      type: "rated",
      showId,
      showName: showDetails.name,
      showImage: showDetails.poster_path,
      seasonNumber,
      rating,
      comment,
      status,
      episodes,
      review,
      timestamp: new Date(),
    });

    await newActivity.save();

    res.status(200).json({
      message: "Season rating and activity recorded successfully",
      seasonRating,
    });
  } catch (error) {
    console.error("Error updating season rating and saving activity:", error);
    res.status(500).json({
      message: "Error updating season rating and saving activity",
    });
  }
};

// Delete a season rating for a user
const deleteSeasonRating = async (req, res) => {
  try {
    const { userId, showId, seasonNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletionResultSeason = await SeasonRating.deleteOne({
      user: userId,
      show: showId,
      season: seasonNumber,
    });

    if (deletionResultSeason.deletedCount === 0) {
      return res.status(404).json({
        message: "Season rating not found for the given user and show",
      });
    }

    const deletionResultActivity = await Activity.deleteMany({
      user: userId,
      showId,
      seasonNumber,
    });

    if (deletionResultActivity.deletedCount === 0) {
      return res.status(404).json({
        message: "Activity not found for the given user and show",
      });
    }

    res.status(200).json({ message: "Season rating removed successfully" });
  } catch (error) {
    console.error("Error removing season rating:", error);
    res.status(500).json({ message: "Error removing season rating" });
  }
};

module.exports = { getSeasonRatings, rateSeason, deleteSeasonRating };