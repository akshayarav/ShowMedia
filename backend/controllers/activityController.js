const Activity = require("../models/Activity");
const User = require("../models/User");
const Comment = require("../models/Comment");
const mongoose = require('mongoose');

// Get activity feed of users the user follows
const getFollowingFeed = async (req, res) => {
  const userId = req.params.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;

    const activities = await Activity.find({
      user: { $in: following },
    })
      .sort({ timestamp: -1 })
      .populate("user", "username first profilePicture")
      .populate({ path: "review", select: "" })
      .lean();

    res.status(200).json(activities);
  } catch (error) {
    console.error(`Error fetching following feed for userId ${userId}:`, error);
    res.status(500).send("Internal Server Error");
  }
};

// Get all activities for a specific user
const getUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const activities = await Activity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("user", "username first profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username first profilePicture",
        },
      })
      .populate({
        path: "comments.replies",
        populate: {
          path: "user",
          select: "username first profilePicture",
        },
      })
      .populate({ path: "review", select: "" })
      .lean();

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Like an activity
const likeActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const userId = req.body.userId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    if (activity.likes.includes(userId)) {
      return res.status(400).send("You have already liked this activity");
    }

    activity.likes.push(userId);
    await activity.save();

    res.status(200).json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error liking activity:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Unlike an activity
const unlikeActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const userId = req.body.userId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    if (!activity.likes.includes(userId)) {
      return res.status(400).send("You have not liked this activity");
    }

    activity.likes.pull(userId);
    await activity.save();

    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    console.error("Error unliking activity:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Add a comment to an activity
const commentOnActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const { userId, comment } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    const newComment = new Comment({
      user: userId,
      username: user.username,
      profilePicture: user.profilePicture,
      first: user.first,
      comment,
    });

    const savedComment = await newComment.save();

    activity.comments.push(savedComment._id);
    await activity.save();

    res.status(200).json({
      message: "Comment added successfully",
      newComment: savedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get all comments for an activity
const getActivityComments = async (req, res) => {
  try {
    const activityId = req.params.activityId;

    const activity = await Activity.findById(activityId).populate({
      path: "comments",
      model: "Comment",
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "user",
          model: "User",
          select: "username profilePicture",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username profilePicture",
          },
        },
      ],
    });

    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    res.status(200).json(activity.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete a comment from an activity
const deleteActivityComment = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const commentId = req.params.commentId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send("Activity not found");
    }

    const commentIndex = activity.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).send("Comment not found");
    }

    activity.comments.splice(commentIndex, 1);
    await activity.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
};

const replyToComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId, replyContent } = req.body;
  
      const originalComment = await Comment.findById(commentId);
      if (!originalComment) {
        return res.status(404).send("Comment not found");
      }
  
      const replyComment = new Comment({
        user: userId,
        comment: replyContent,
      });
  
      const savedReply = await replyComment.save();
      originalComment.replies.push(savedReply._id);
      await originalComment.save();
  
      const updatedOriginalComment = await Comment.findById(commentId).populate(
        "replies"
      );
  
      res.status(200).json(updatedOriginalComment);
    } catch (error) {
      console.error("Error replying to comment:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  const likeReply = async (req, res) => {
    try {
      const { replyId } = req.params;
      const { userId } = req.body;
  
      const reply = await Comment.findById(replyId);
      if (!reply) {
        return res.status(404).send("Reply not found");
      }
  
      if (reply.likes.includes(userId)) {
        return res.status(400).send("You have already liked this reply");
      }
  
      reply.likes.push(userId);
      await reply.save();
  
      res.status(200).json({ message: "Like added successfully to reply" });
    } catch (error) {
      console.error("Error liking reply:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  const unlikeReply = async (req, res) => {
    try {
      const { replyId } = req.params;
      const { userId } = req.body;
  
      const reply = await Comment.findById(replyId);
      if (!reply) {
        return res.status(404).send("Reply not found");
      }
  
      if (!reply.likes.includes(userId)) {
        return res.status(400).send("You have not liked this reply");
      }
  
      reply.likes = reply.likes.filter(
        (likeUserId) => likeUserId.toString() !== userId.toString()
      );
      await reply.save();
  
      res.status(200).json({ message: "Unlike successful for reply" });
    } catch (error) {
      console.error("Error unliking reply:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const likeComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
  
      if (comment.likes.includes(userId)) {
        return res.status(400).send("You have already liked this comment");
      }
  
      comment.likes.push(userId);
      await comment.save();
  
      res.status(200).json({ message: "Like added successfully" });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  const unlikeComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
  
      if (!comment.likes.includes(userId)) {
        return res.status(400).send("You have not liked this comment");
      }
  
      comment.likes = comment.likes.filter(
        (likeUserId) => likeUserId.toString() !== userId.toString()
      );
      await comment.save();
  
      res.status(200).json({ message: "Unlike successful" });
    } catch (error) {
      console.error("Error unliking comment:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  module.exports = {

    // Add other methods here as needed
  };

module.exports = {
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
};