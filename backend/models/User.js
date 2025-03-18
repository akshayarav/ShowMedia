const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  passwordHash: String,
  first: String,
  last: String,
  profilePicture: {
    type: String,
    default: "/default_profile.jpg",
  },
  bio: {
    type: String,
    default: "",
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  timestamp: { type: Date, default: Date.now },
  reviewCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema)