import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard/ReviewCard";
import axios from "axios";

function Reviews({ showId }) {
    const [reviews, setReviews] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')); // Parse the user object from localStorage
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

            const response = await axios.post(`${apiUrl}/api/reviews`, newReview);
            setReviews([...reviews, response.data]); // Append the new review to the current list
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/reviews/${showId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [showId]);

    return (
        <div className="d-flex flex-column align-items-center">
            <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={() => handleAddReview(5, "Great show!")}>
                Add Review
            </button>
            {reviews.map((review) => (
                <ReviewCard key={review._id} {...review} />
            ))}
        </div>
    );
}

export default Reviews;
