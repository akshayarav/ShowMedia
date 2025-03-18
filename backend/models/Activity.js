const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  showId: Number,
  showName: String,
  showImage: String,
  seasonNumber: Number,
  rating: Number,
  status: String,
  episodes: String,
  comment: String,
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  timestamp: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Activity", activitySchema);