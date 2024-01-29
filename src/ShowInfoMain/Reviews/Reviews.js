import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard/ReviewCard";
import axios from "axios";
import AddReviewModal from "./AddReviewModal";

function Reviews({ showId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsFollowing, setReviewsFollowing] = useState([]);
  const [showName, setShowName] = useState("");

  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReviewId, setUserReviewId] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showReviewModal, setShowReviewModal] = useState(false);
  const toggleReviewModal = () => setShowReviewModal(!showReviewModal);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchReviewsFromFollowing = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/reviews/following/${user._id}/${showId}`
      );
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

      setReviews((prevReviews) => [...prevReviews, response.data]);
    } catch (error) {
      console.error("Error adding review:", error);
    }

    try {
      const response = await fetch(`${apiUrl}/rateSeason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          showId: showId,
          rating: score,
          comment: text,
          status: "Review",
          reviewUserName: user.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message || `Failed to add rating and comment for Show`
        );
        return;
      }
    } catch (err) {
      console.error(err);
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
        const userReview = response.data.find(
          (review) => review.username === user.username
        );
        const followingReviews = await fetchReviewsFromFollowing();
        console.log(followingReviews)
        setReviewsFollowing(followingReviews);

        const sortedReviews = followingReviews.sort((a, b) => {
          return b.votes - a.votes;
        });

        setReviews(
          sortedReviews.filter((review) => review._id !== userReviewId)
        );
        if (userReview) {
          setHasReviewed(true);
          setUserReviewId(userReview._id);
          setUserReview(userReview);
        } else {
          setUserReviewId(null);
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchShowDetails();
    fetchReviews();
  }, [showId, user.username]);

  const handleRemoveReview = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/reviews/${userReviewId}?username=${encodeURIComponent(
          user.username
        )}`
      );
      setReviews(reviews.filter((review) => review._id !== userReviewId));
      setHasReviewed(false);
      setUserReviewId(null);
    } catch (error) {
      console.error("Error removing review:", error);
    }
    try {
      const response = await fetch(`${apiUrl}/rateSeason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          showId: showId,
          status: "Removed Review",
          reviewUserName: user.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message || `Failed to add rating and comment for Show`
        );
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex flex-column">
        {showReviewModal && (
          <AddReviewModal
            showName={showName}
            showId={showId}
            handleAddReview={handleAddReview}
            closeModal={toggleReviewModal}
          />
        )}
        <div
          className="mt-2 d-flex flex-column align-items-center border-bottom p-2 mb-3"
          style={{ width: "100%" }}
        >
          <div className="d-flex justify-content-center" style={{ width: "100%" }}>
            <h2 className="fw-bold text-white mb-1">Your Chat</h2>
          </div>
          {hasReviewed ? (
            <div className="d-flex justify-content-center align-items-center">
              <ReviewCard
                vw={55}
                showName={showName}
                key={userReviewId}
                review={userReview}
                handleRemoveReview={handleRemoveReview}
              />
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-2 mb-2"
              onClick={toggleReviewModal}
            >
              <span className="material-icons">add</span>
            </button>
          )}
        </div>
      </div>

      <div className="accordion overflow-hidden rounded-4" id="accordionExample" style = {{minWidth: "60vw"}}> 
        <div className="accordion-item">
          <div>
            <h2 className="accordion-header" id="headingFive">
              <button className="accordion-button custom-accordion-arrow fw-bold m-0 text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                Chats by Friends
              </button>
            </h2>
            <div className="accordion-collapse collapse show" id="collapseFive" aria-labelledby="headingFive" >
              {reviewsFollowing.length > 0 ? (
                reviewsFollowing
                  .filter((review) => review._id !== userReviewId)
                  .map((review) => (
                    <ReviewCard
                      showName={showName}
                      key={review._id}
                      review={review}
                    />
                  ))
              ) : (
                <p className="text-muted">No chats by friends yet, share this show!</p>
              )}
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <div>
            <h2 className="accordion-header" id="headingSix">
              <button className="accordion-button custom-accordion-arrow fw-bold m-0 text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="true" aria-controls="collapseSix">
                Top Chats
              </button>
            </h2>
            <div className="accordion-collapse collapse show" id="collapseSix" aria-labelledby="headingSix" >
              {reviews.length > 0 ? (
                reviews
                  .filter((review) => review._id !== userReviewId)
                  .map((review) => (
                    <ReviewCard
                      showName={showName}
                      key={review._id}
                      review={review}
                    />
                  ))
              ) : (
                <p className="text-muted">No chats yet, be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
