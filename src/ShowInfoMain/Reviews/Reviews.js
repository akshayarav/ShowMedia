import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard/ReviewCard";
import axios from "axios";
import AddReviewModal from './AddReviewModal';

function Reviews({ showId }) {
    const [reviews, setReviews] = useState([]);
    const [reviewsFollowing, setReviewsFollowing] = useState([]);
    const [showName, setShowName] = useState("");

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
            return response.data;
        } catch (error) {
            console.error("Error fetching reviews from following:", error);
            return [];
        }
    };

    const handleAddReview = async (showId, score, text) => {
        const newReview = {
            showId,
            score,
            text,
            profileImg: user.profilePicture,
            username: user.username,
        };

        try {
            const response = await axios.post(`${apiUrl}/api/reviews`, newReview);

            setHasReviewed(true);
            setUserReview(response.data);
            setUserReviewId(response.data._id);

            setReviews(prevReviews => [...prevReviews, response.data]);
        } catch (error) {
            console.error("Error adding review:", error);
        }

        try {
            const response = await fetch(`${apiUrl}/rateSeason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    showId: showId,
                    rating: score,
                    comment: text,
                    status: "Review",
                    reviewUserName: user.username
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message || `Failed to add rating and comment for Show`);
                return;
            }

        } catch (err) {
            console.error(err)
        }
    };

    const handleRemoveReview = async () => {
        try {
            await axios.delete(`${apiUrl}/api/reviews/${userReviewId}?username=${encodeURIComponent(user.username)}`);
            setReviews(reviews.filter(review => review._id !== userReviewId));
            setHasReviewed(false);
            setUserReviewId(null);
        } catch (error) {
            console.error("Error removing review:", error);
        }
        try {
            const response = await fetch(`${apiUrl}/rateSeason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    showId: showId,
                    status: "Removed Review",
                    reviewUserName: user.username
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message || `Failed to add rating and comment for Show`);
                return;
            }

        } catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        const fetchShowDetails = async () => {
            const tmdbApiKey = process.env.REACT_APP_API_KEY;
            const tmdbApiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbApiKey}`;

            try {
                const response = await axios.get(tmdbApiUrl);
                setShowName(response.data.name);
            } catch (error) {
                console.error("Error fetching show details:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/reviews/${showId}`);
                const userReview = response.data.find(review => review.username === user.username);
                const followingReviews = await fetchReviewsFromFollowing();
                setReviewsFollowing(followingReviews)

                const filteredReviews = response.data.filter(review =>
                    !followingReviews.some(followingReview => followingReview._id === review._id)
                );

                const sortedReviews = filteredReviews.sort((a, b) => {
                    return b.votes - a.votes;
                });

                setReviews(sortedReviews.filter(review => review._id !== userReviewId));
                if (userReview) {
                    setHasReviewed(true);
                    setUserReviewId(userReview._id);
                    setUserReview(userReview)
                } else {
                    setUserReviewId(null);
                    setReviews(response.data)
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchShowDetails();
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
                    <ReviewCard showName={showName} key={userReviewId} review={userReview} />
                </div>
            }
            <h2 className="fw-bold text-white mt-4">Reviews by Following</h2>
            {
                reviewsFollowing.length > 0 && (
                    <>
                        {reviewsFollowing.filter(review => review._id !== userReviewId).map((review) => (
                            <ReviewCard showName={showName} key={review._id} review={review} />
                        ))}
                    </>
                )
            }

            <h2 className="fw-bold text-white mt-4">Top Reviews</h2>
            {
                reviews.length > 0 && (
                    <>
                        {reviews.filter(review => review._id !== userReviewId).map((review) => (
                            <ReviewCard showName={showName} key={review._id} review={review} />
                        ))}
                    </>
                )
            }
        </div>
    );
}

export default Reviews;
