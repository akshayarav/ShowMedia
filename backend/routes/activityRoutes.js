const express = require("express");
const {
  getFollowingFeed,
  getUserActivities,
  likeActivity,
  unlikeActivity,
  commentOnActivity,
  getActivityComments,
  deleteActivityComment,
  replyToComment,
  likeReply,
  unlikeReply,
  likeComment,
  unlikeComment,
} = require("../controllers/activityController");

const router = express.Router();

router.get("/followingFeed/:userId", getFollowingFeed);
router.get("/:userId", getUserActivities);
router.post("/:activityId/like", likeActivity);
router.post("/:activityId/unlike", unlikeActivity);
router.post("/:activityId/comment", commentOnActivity);
router.get("/:activityId/comments", getActivityComments);
router.delete("/:activityId/comment/:commentId", deleteActivityComment);
router.post("/comment/:commentId/reply", replyToComment);
router.post("/comment/:commentId/reply/:replyId/like", likeReply);
router.post("/comment/:commentId/reply/:replyId/unlike", unlikeReply);

// Add routes for liking and unliking comments
router.post("/comment/:commentId/like", likeComment);
router.post("/comment/:commentId/unlike", unlikeComment);

module.exports = router;