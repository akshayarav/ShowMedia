const Review = require('../models/Review');
const User = require('../models/User'); // Add this import

//Add a new review
const addReview = (req, res) => {
  const { showId, username } = req.body;

  Review.findOne({ showId, username })
    .then(async (existingReview) => {
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this show." });
      } else {
        const newReview = new Review({
          showId: req.body.showId,
          score: req.body.score,
          text: req.body.text,
          profileImg: req.body.profileImg,
          username: req.body.username,
          upvotes: [],
          downvotes: [],
        });

        newReview
          .save()
          .then(async (review) => {
            await User.updateOne({ username }, { $inc: { reviewCount: 1 } });
            res.status(201).json(review);
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

//Delete a review with id {reviewId} by user with username {username}
const removeReview = (req, res) => {
  const reviewId = req.params.reviewId;
  const username = req.query.username;

  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review.username !== username) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this review" });
      }

      Review.findByIdAndDelete(reviewId)
        .then(async () => {
          await User.updateOne({ username }, { $inc: { reviewCount: -1 } });
          res.status(200).json({ message: "Review deleted successfully" });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

//Get all the reviews for show with id {showId}
const getShowReviews = (req, res) => {
  Review.find({ showId: req.params.showId })
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Endpoint to upvote a review
const upvoteReview = (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId;

  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const alreadyUpvoted = review.upvotes.includes(userId);
      const alreadyDownvoted = review.downvotes.includes(userId);
      if (!alreadyUpvoted) {
        review.upvotes.push(userId);
      }
      if (alreadyDownvoted) {
        review.downvotes = review.downvotes.filter((id) => id !== userId);
      }

      review
        .save()
        .then(() => res.json({ message: "Review upvoted successfully" }))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Endpoint to downvote a review
const downvoteReview = (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId;

  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const alreadyDownvoted = review.downvotes.includes(userId);
      const alreadyUpvoted = review.upvotes.includes(userId);
      if (!alreadyDownvoted) {
        review.downvotes.push(userId);
      }
      if (alreadyUpvoted) {
        review.upvotes = review.upvotes.filter((id) => id !== userId);
      }

      review
        .save()
        .then(() => res.json({ message: "Review downvoted successfully" }))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

//Endpoint to remove vote on review with id {reviewId} by user with id {userId}
const unvoteReview = (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId;

  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const indexUpvote = review.upvotes.indexOf(userId);
      const indexDownvote = review.downvotes.indexOf(userId);
      let voteRemoved = false;

      if (indexUpvote > -1) {
        review.upvotes.splice(indexUpvote, 1); // Remove the user's upvote
        voteRemoved = true;
      }
      if (indexDownvote > -1) {
        review.downvotes.splice(indexDownvote, 1); // Remove the user's downvote
        voteRemoved = true;
      }

      if (!voteRemoved) {
        return res
          .status(400)
          .json({ message: "User has not voted on this review" });
      }

      review
        .save()
        .then(() => res.json({ message: "Vote retracted successfully" }))
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

//Endpoint to get reviews for a specific show from following
const getReviewFromFollowing = async (req, res) => {
  const userId = req.params.userId;
  const showId = req.params.showId;

  try {
    const user = await User.findById(userId).populate("following");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUsernames = user.following.map(
      (followedUser) => followedUser.username
    );

    const reviewsFromFollowing = await Review.find({
      username: { $in: followedUsernames },
      showId: showId, // Filter by showId
    });

    res.json(reviewsFromFollowing);
  } catch (error) {
    console.error("Error fetching reviews from following:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addReview, 
  removeReview, 
  getShowReviews,
  upvoteReview, 
  downvoteReview, 
  unvoteReview, 
  getReviewFromFollowing
};