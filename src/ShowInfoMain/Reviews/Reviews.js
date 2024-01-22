import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard/ReviewCard";
import axios from "axios";
import AddReviewModal from './AddReviewModal';

function Reviews({ showId }) {
    const [reviews, setReviews] = useState([]);
    const [reviewsFollowing, setReviewsFollowing] = useState([]);

    const [hasReviewed, setHasReviewed] = useState(false);
    const [userReviewId, setUserReviewId] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [showReviewModal, setShowReviewModal] = useState(false);
    const toggleReviewModal = () => setShowReviewModal(!showReviewModal);
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchReviewsFromFollowing = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/reviews/following/${user._id}/${showId}`);
            return response.data; // This should be an array of review IDs
        } catch (error) {
            console.error("Error fetching reviews from following:", error);
            return [];
        }
    };


    const handleAddReview = async (showId, score, text) => {
        const newReview = {
            showId, // Assuming you want to include the showId in the review
            score,
            text,
            profileImg: user.profilePicture, // User's profile image
            username: user.username, // User's username
            // No need to include upvotes and downvotes here; they start as empty in the backend
        };

        try {
            const response = await axios.post(`${apiUrl}/api/reviews`, newReview);

            // Update states with the response data
            setHasReviewed(true);
            setUserReview(response.data); // The new review now includes the _id
            setUserReviewId(response.data._id); // Store the ID of the user's review

            // Append the new review to the current list
            setReviews(prevReviews => [...prevReviews, response.data]);
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };


    const handleRemoveReview = async () => {
        try {
            await axios.delete(`${apiUrl}/api/reviews/${userReviewId}?username=${encodeURIComponent(user.username)}`);
            setReviews(reviews.filter(review => review._id !== userReviewId));
            setHasReviewed(false);
            setUserReviewId(null); // Reset the userReviewId
        } catch (error) {
            console.error("Error removing review:", error);
        }
    };


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/reviews/${showId}`);
                const userReview = response.data.find(review => review.username === user.username);
                const followingReviews = await fetchReviewsFromFollowing();
                setReviewsFollowing(followingReviews)
                console.log("FOLLOWING REVIEWS: " + followingReviews)

                const sortedReviews = response.data.sort((a, b) => {
                    return b.votes - a.votes; // Sort by 'votes' in descending order
                });
                setReviews(sortedReviews.filter(review => review._id !== userReviewId));
                if (userReview) {
                    setHasReviewed(true);
                    setUserReviewId(userReview._id); // Store the ID of the user's review
                    setUserReview(userReview)
                } else {
                    setUserReviewId(null); // Reset the userReviewId if no review is found
                    setReviews(response.data)
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [showId, user.username]);

    return (
        <div className="d-flex flex-column align-items-center">
            {hasReviewed ? (
                <button type="button" className="btn btn-outline-danger btn-sm px-3 rounded-pill" onClick={handleRemoveReview}>
                    Remove My Review
                </button>
            ) : (
                <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={toggleReviewModal}>
                    Add Review
                </button>
            )}
            {showReviewModal && <AddReviewModal
                showId={showId}
                handleAddReview={handleAddReview}
                closeModal={toggleReviewModal}
            />}
            {hasReviewed &&
                <div className="mt-5 d-flex flex-column align-items-center" style={{ width: "100%" }}>
                    <h2 className="fw-bold text-white mb-1">Your Review</h2>
                    <ReviewCard key={userReviewId} review={userReview} />
                </div>
            }
            <h2 className="fw-bold text-white mt-4">Reviews by Following</h2>
            {
                reviewsFollowing.length > 0 && (
                    <>
                        {reviewsFollowing.filter(review => review._id !== userReviewId).map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </>
                )
            }

            <h2 className="fw-bold text-white mt-4">Top Reviews</h2>
            {
                reviews.length > 0 && (
                    <>
                        {reviews.filter(review => review._id !== userReviewId).map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </>
                )
            }
        </div>
    );
}

export default Reviews;
