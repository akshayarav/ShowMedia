import React, { useState } from "react";
import axios from "axios";
import CommentModal from "./CommentModal";
import ReviewCard from "../ShowInfoMain/Reviews/ReviewCard/ReviewCard";
import CommentsList from "./CommentLists";

function FeedItem({ activity, refresh, toggleRefresh }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const formattedTimestamp = new Date(activity.timestamp).toLocaleString();
  const image = activity.showImage
    ? `https://image.tmdb.org/t/p/w500${activity.showImage}`
    : "error.jpg";
  const status =
    activity.status === "Watching"
      ? `watched episode ${activity.episodes} of`
      : activity.status === "Planning"
        ? "is planning to watch"
        : activity.status === "Completed"
          ? "completed"
          : activity.status === "Dropped"
            ? "dropped" :
            activity.status === "Review"
              ? "Made an official review for the show" :
              activity.status === "Removed Review"
                ? "Removed their review for"
                : "unknown";

  const username = activity.user.username;
  const first = activity.user.first;

  const [isLiked, setIsLiked] = useState(
    activity.likes.includes(localStorage.getItem("userId"))
  );
  const [likeCount, setLikeCount] = useState(activity.likes.length);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null)

  const openModal = () => {
    setModalOpen(true);
  };

  // In parent component
  const closeModal = () => {
    setModalOpen(false);
    toggleRefresh()
    setReplyModalOpen(false)
    setModalOpen(false)
    setSelectedCommentId(null)
  };

  const openReplyModal = (commentId) => {
    setReplyModalOpen(true)
    setModalOpen(true)
    setSelectedCommentId(commentId)
  }


  const handleLike = async () => {
    const userId = localStorage.getItem("userId");
    const activityId = activity._id;

    const endpoint = isLiked
      ? `${apiUrl}/api/activities/${activityId}/unlike`
      : `${apiUrl}/api/activities/${activityId}/like`;
    try {
      await axios.post(endpoint, { userId });
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span key={i} className="material-icons md-18">
          {i <= rating ? "star" : "star_border"}
        </span>
      );
    }
    return stars;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else if (diffInWeeks < 52) {
      return `${diffInWeeks}w`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  return (
    <div className="border-bottom py-3 px-lg-3">
      <div className="bg-glass p-3 feed-item rounded-4 shadow-sm">
        <div className="d-flex">
          <div className="me-3 image-container">
            <img
              src={activity.user.profilePicture}
              className="img-fluid rounded-circle user-img"
              alt="profile-img"
              style={{ maxWidth: "50px", height: "auto" }}
            />
          </div>
          <div className="flex-grow-1">
            <div
              key={activity._id}
              className="d-flex justify-content-between align-items-start text-white text-decoration-none"
            >
              <div className="flex-grow-1">
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <p className="text-white mb-0">{first}</p>
                    <p className="ms-1 text-muted mb-0">@{username}</p>
                    <p className="text-muted ms-2 mb-0">{formattedTimestamp}</p>
                  </div>
                  <h6 className="text-primary">{status}</h6>
                </div>

                <div className="mb-2">
                  <h5 className="mb-0">
                    {activity.showName}
                    {activity.status !== "Review" && activity.status !== "Removed Review" && <span> - Season {activity.seasonNumber}</span>}
                  </h5>
                </div>

                <div className="mb-4">
                  {activity.status !== "Review" && activity.status !== "Removed Review" &&
                    <div>
                      <h6 className="mb-0 ">{renderStars(activity.rating)}</h6>
                      ({activity.rating} / 10)
                    </div>
                  }
                  {activity.status !== "Review" && activity.status !== "Removed Review" && <p className="mb-3 mt-3">Comment: "{activity.comment}"</p>}
                </div>

                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>
                    <button
                      className="text-muted text-decoration-none d-flex align-items-start fw-light "
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <span className="material-icons md-20 me-1">
                        {isLiked ? "thumb_up" : "thumb_up_off_alt"}
                      </span>
                      <span>{likeCount}</span>
                    </button>
                  </div>
                  <div>
                    <div
                      onClick={openModal}
                      className="text-muted text-decoration-none d-flex align-items-start fw-light"
                    >
                      <span className="material-icons md-20 me-2">
                        chat_bubble_outline
                      </span>
                    </div>
                    {openModal && isReplyModalOpen ? (
                      <CommentModal
                        activity={activity}
                        refresh={refresh}
                        toggleRefresh={toggleRefresh}
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        formatTimestamp={formatTimestamp}
                        commentId = {selectedCommentId}
                        replyModalStatus={true}
                      />
                    ) : (
                      <CommentModal
                        activity={activity}
                        refresh={refresh}
                        toggleRefresh={toggleRefresh}
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        formatTimestamp={formatTimestamp}
                        replyModalStatus={false}
                      />
                    )}
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-muted text-decoration-none d-flex align-items-start fw-light"
                    >
                      <span className="material-icons md-20 me-2">repeat</span>
                      <span>617</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-muted text-decoration-none d-flex align-items-start fw-light"
                    >
                      <span className="material-icons md-18 me-2">share</span>
                      <span>Share</span>
                    </a>
                  </div>
                </div>
              </div>

              <img
                src={image}
                className="img-fluid rounded-4 ms-3"
                alt={activity.showName}
                style={{ maxWidth: "100px", height: "auto" }}
              />
            </div>
          </div>
        </div>
        {activity.status === "Review" && activity.review && <ReviewCard review={activity.review} />}
        <CommentsList activityId={activity._id} refresh={refresh} toggleRefresh={toggleRefresh} openReplyModal={(commentId) => openReplyModal(commentId)} />
      </div>
    </div>
  );
}

export default FeedItem;
