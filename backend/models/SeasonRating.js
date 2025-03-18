const mongoose = require('mongoose');

const seasonRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  show: Number,
  season: Number,
  rating: Number,
  comment: String,
  status: String,
  episodes: String,
  hours: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("SeasonRating", seasonRatingSchema);