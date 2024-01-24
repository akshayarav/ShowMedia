import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
// import ReplyModal from "./ReplyModal";

const CommentModal = ({
  image,
  activity,
  refresh,
  toggleRefresh,
  isModalOpen,
  closeModal,
  formatTimestamp,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const activityId = activity._id;
  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!activityId || !isModalOpen) return;

      try {
        const response = await axios.get(
          `${apiUrl}/api/activities/${activityId}/comments`
        );
        const updatedComments = response.data.map((comment) => ({
          ...comment,
          isLiked: comment.likes.includes(userId),
          replies: comment.replies.map((reply) => ({
            ...reply,
            isLiked: reply.likes.includes(userId),
          })),
        }));
        setComments(updatedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [activityId, isModalOpen, comments, refresh, apiUrl, userId]);

  if (!isModalOpen) return null;

  const openReplyModal = () => {
    console.log("reply modal opened");
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    console.log("reply modal closed");
    setReplyModalOpen(false);
  };

  const submitComment = async () => {
    const userId = localStorage.getItem("userId");

    if (!newComment.trim()) {
      console.error("Cannot submit empty comment");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/activities/${activityId}/comment`,
        { userId, comment: newComment }
      );

      if (response.data && response.data.newComment) {
        setNewComment("");
      } else {
        console.error(
          "New comment structure is not as expected:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error submitting new comment:", error);
    } finally {
      toggleRefresh();
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleReplyClick = (commentId) => {
    setSelectedCommentId(commentId);
    openReplyModal();
  };

  const handleCommentLike = async (commentId) => {
    const userId = localStorage.getItem("userId");
    console.log("like");
    setComments(
      comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            isLiked: true,
            likes: [...comment.likes, userId],
          };
        }
        return comment;
      })
    );

    try {
      await axios.post(`${apiUrl}/api/activities/comment/${commentId}/like`, {
        userId,
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLiked: false,
              likeCount: (comment.likeCount || 1) - 1,
              likes: comment.likes.filter((id) => id !== userId),
            };
          }
          return comment;
        })
      );
    }
  };

  const handleCommentUnlike = async (commentId) => {
    const userId = localStorage.getItem("userId");
    console.log("unlike");
    setComments(
      comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            isLiked: false,
            likes: comment.likes.filter((id) => id !== userId),
          };
        }
        return comment;
      })
    );

    try {
      await axios.post(`${apiUrl}/api/activities/comment/${commentId}/unlike`, {
        userId,
      });
    } catch (error) {
      console.error("Error unliking comment:", error);
      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLiked: true,
              likeCount: (comment.likeCount || 0) + 1,
              likes: [...comment.likes, userId],
            };
          }
          return comment;
        })
      );
    }
  };

  return (
    <Modal
      show={true}
      onHide={closeModal}
      centered
      className="modal fade modal-xl"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content rounded-4 shadow-sm border-0 bg-brown-gradient-color">
          <div className="modal-header d-none">
            <h5 className="modal-title" id="exampleModalLabel2">
              Modal title
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-0">
            <div className="row m-0">
              <div className="content-body px-web-0">
                <div className="border-bottom">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0 text-bold details-container">
                      Comments
                    </h5>
                    <div className="small dropdown p-3">
                      <a
                        href="#"
                        className="text-muted text-decoration-none material-icons"
                        onClick={closeModal}
                      >
                        close
                      </a>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom p-2">
                  <div className="d-flex">
                    <a href="#" className="text-decoration-none">
                      <img
                        src={activity.user.profilePicture}
                        className="img-fluid rounded-circle"
                        alt="profile-img"
                        style={{ width: "40px", height: "40px", marginRight: "10px", marginLeft: "20px", marginBottom: "20px", marginTop: "20px" }}
                      />
                    </a>
                    <div className="d-flex ms-1 justify-content-between" style={{ marginRight: "20px", marginBottom: "20px", marginTop: "20px" }}>
                      <div>
                        <h6 className="fw-bold text-body mb-0">
                          {activity.user.first}
                        </h6>
                        <p className="text-muted mb-0 small">
                          @{activity.user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h6 className="mb-0 text-bold" style={{ marginRight: "20px" }}>
                    {activity.showName} Season {activity.seasonNumber}
                  </h6>
                  <div style={{ marginRight: "20px" }}>
                    <p className="mb-0">{activity.rating}/10</p>
                  </div>
                </div>

                <div className="comments p-3">
                  <div
                    className={`comments ${
                      comments.length > 6 ? "scrollable-comments" : ""
                    }`}
                  >
                    {comments.map((comment) => (
                      <div key={comment._id} className="mb-3 d-flex">
                        <a href="#" className="text-white text-decoration-none" style={{ marginLeft: "20px" }}>
                          <img
                            src={comment.user.profilePicture}
                            className="img-fluid rounded-circle"
                            alt="commenters-img"
                          />
                        </a>
                        <div className="ms-2 small flex-grow-1" style={{ marginRight: "20px" }}>
                          <div className="d-flex justify-content-between bg-glass px-3 py-2 rounded-4 mb-1 comment-box">
                            <div>
                              <p className="fw-500 mb-0 comment-text">
                                {comment.user.username}
                              </p>
                              <span className="text-muted comment-text">
                                {comment.comment}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                comment.isLiked
                                  ? handleCommentUnlike(comment._id)
                                  : handleCommentLike(comment._id)
                              }
                              className="border-0 bg-transparent align-self-start"
                            >
                              <span
                                className="material-icons"
                                style={{ fontSize: "18px" }}
                              >
                                {comment.isLiked
                                  ? "favorite"
                                  : "favorite_border"}
                              </span>
                            </button>
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <span className="text-muted">
                              {comment.likes.length || 0} Likes
                            </span>
                            <span className="fs-3 text-muted material-icons mx-1">
                              circle
                            </span>
                            <button
                              className="small text-muted text-decoration-none"
                              onClick={() => handleReplyClick(comment._id)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "0",
                                cursor: "pointer",
                              }}
                            >
                              Reply
                            </button>
                            {/* <div>
                              <ReplyModal
                                commentId={selectedCommentId}
                                activityId={activityId}
                                refresh={refresh}
                                toggleRefresh={toggleRefresh}
                                isReplyModalOpen={isReplyModalOpen}
                                closeReplyModal={closeReplyModal}
                                formatTimestamp={formatTimestamp}
                              />
                            </div> */}

                            <span className="fs-3 text-muted material-icons mx-1">
                              circle
                            </span>
                            <span className="small text-muted">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="d-flex align-items-center p-2 border-top">
                    <span className="material-icons bg-transparent border-0 text-primary pe-2 md-36">
                      account_circle
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3 fw-light bg-light form-control-text"
                      placeholder="Write your comment"
                      value={newComment}
                      onChange={handleNewCommentChange}
                    />
                    <button
                      className="text-primary ps-2 text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        submitComment();
                      }}
                      style={{ background: "none", border: "none" }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer d-none"></div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
