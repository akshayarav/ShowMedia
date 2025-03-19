const express = require('express')
const { addReview, removeReview, getShowReviews, upvoteReview,
    downvoteReview, unvoteReview, getReviewFromFollowing
 } = require('../controllers/reviewController')

const router = express.Router()

router.post('/add', addReview);
router.delete('/remove/:reviewId', removeReview);
router.get('/get/:showId', getShowReviews);
router.post('/:reviewId/upvote', upvoteReview);
router.post('/:reviewId/downvote', downvoteReview);
router.post('/:reviewId/unvote', unvoteReview);
router.get('/following/:userId/:showId', getReviewFromFollowing);
router.get('/test', (req, res) => {
    res.json({ message: 'Review API is working' });
  });

module.exports = router;
