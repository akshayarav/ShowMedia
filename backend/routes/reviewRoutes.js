const express = require('express')
const { addReview, removeReview, getShowReviews, upvoteReview,
    downvoteReview, unvoteReview, getReviewFromFollowing
 } = require('../controllers/reviewController')

const router = express.Router()

router.post('', addReview);
router.delete(':reviewId', removeReview);
router.get(':showId', getShowReviews);
router.post('/:reviewId/upvote', upvoteReview);
router.post('/:reviewId/downvote', downvoteReview);
router.post('/:reviewId/unvote', unvoteReview);
router.get('/following/:userId', getReviewFromFollowing);

module.exports = router;
