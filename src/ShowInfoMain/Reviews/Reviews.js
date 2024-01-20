import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard/ReviewCard";
import axios from "axios";

function Reviews({ showId }) {
    const [reviews, setReviews] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [userReviewId, setUserReviewId] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleAddReview = async (score, text) => {
        const newReview = {
            showId, // Assuming you want to include the showId in the review
            score,
            text,
            profileImg: user.profileImg, // User's profile image
            username: user.username, // User's username
        };
        console.log(newReview)
        try {
            const newReview = {
                showId, // Assuming you want to include the showId in the review
                score,
                text,
                profileImg: user.profilePicture, // User's profile image
                username: user.username, // User's username
            };
            setHasReviewed(true);
            setUserReview(newReview)

            const response = await axios.post(`${apiUrl}/api/reviews`, newReview);
            setReviews([...reviews, response.data]); // Append the new review to the current list
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
                setReviews(response.data);
                const userReview = response.data.find(review => review.username === user.username);
                if (userReview) {
                    setHasReviewed(true);
                    setUserReviewId(userReview._id); // Store the ID of the user's review
                } else {
                    setUserReviewId(null); // Reset the userReviewId if no review is found
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
                    Remove Review
                </button>
            ) : (
                <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={() => handleAddReview(5, "Great show!")}>
                    Add Review
                </button>
            )}
            {userReview &&
                <div>
                    <h2 className="fw-bold text-white mb-1">Your Review</h2>
                    <ReviewCard key={userReview._id} {...userReview} />
                </div>
            }
            {reviews.map((review) => (
                <ReviewCard key={review._id} {...review} />
            ))}
        </div>
    );
}

export default Reviews;
