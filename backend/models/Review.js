const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    showId: Number,
    score: Number,
    text: String,
    profileImg: String,
    username: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.virtual("votes").get(function () {
  return this.upvotes.length - this.downvotes.length;
});

module.exports = mongoose.model("Review", reviewSchema);