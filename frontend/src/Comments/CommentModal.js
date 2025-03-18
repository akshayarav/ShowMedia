import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const CommentModal = ({
  activity,
  refresh,
  toggleRefresh,
  isModalOpen,
  closeModal,
  formatTimestamp,
  commentId,
  replyModalStatus
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const activityId = activity._id;

  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [replyComment, setReplyComment] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  // const [replyTag, setReplyTag] = useState('')

  useEffect(() => {
    setReplyModalOpen(replyModalStatus);
    setSelectedCommentId(commentId)
  }, [replyModalStatus, commentId]);


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
        const sortedComments = updatedComments.sort((a, b) => {
          return (b.likes.length - a.likes.length)
        })
        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments()
  }, [refresh, activityId, isModalOpen, isReplyModalOpen]);

  useEffect(() => {
    if (!selectedCommentId || !isReplyModalOpen) return;
    const fetchCommentAndReplies = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/activities/${activityId}/comments`
        );
        const matchingComment = response.data.find(c => c._id === selectedCommentId);

        if (matchingComment) {
          setReplyComment(matchingComment);
          const updatedReplies = matchingComment.replies.map((comment) => ({
            ...comment,
            isLiked: comment.likes.includes(userId),
          }));
          const sortedReplies = updatedReplies.sort((a, b) => {
            return (b.likes.length - a.likes.length)
          })
          setReplies(sortedReplies);
        } else {
          console.error("Matching comment not found");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentAndReplies();
  }, [selectedCommentId, isReplyModalOpen, apiUrl, refresh, commentId]);



  if (!isModalOpen) return null;


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

  const submitReply = async () => {
    if (!replyContent.trim()) {
      console.error("Cannot submit empty reply");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/activities/comment/${selectedCommentId}/reply`,
        {
          userId,
          replyContent,
        }
      );

      const updatedReplies = response.data.replies;

      setReplies(updatedReplies);
      setReplyContent("");

    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      toggleRefresh();
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleReplyClick = (commentId) => {
    setSelectedCommentId(commentId);
    setReplyModalOpen(true);
  };


  const handleCommentLike = async (commentId, is_reply) => {
    const userId = localStorage.getItem("userId");
    if (is_reply) {
      setReplies(
        replies.map((comment) => {
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
        console.error("Error liking reply:", error);
        setReplies(
          replies.map((comment) => {
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
    }
    else {
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
    }
  };

  const handleCommentUnlike = async (commentId, is_reply) => {
    const userId = localStorage.getItem("userId");
    if (is_reply) {
      setReplies(
        replies.map((comment) => {
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
        console.error("Error liking reply:", error);
        setReplies(
          replies.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                isLiked: true,
                likeCount: (comment.likeCount || 1) - 1,
                likes: [...comment.likes, userId],
              };
            }
            return comment;
          })
        );
      }
    }
    else {

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
    }
  };

  const parseComment = (comment) => {
    const parts = comment.split(/(@\w+)/);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        // Assuming username is the part after '@'
        const username = part.substring(1);
        return (
          <Link key={index} to={`/profile/${username}`}>
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <Modal
      show={true}
      onHide={closeModal}
      centered
      className="modal fade modal-xl"
      dialogClassName="modal-dialog-large"
      style={{ maxWidth: '90%' }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '90%', width: '90%' }}>
        {(!isReplyModalOpen) ?
          <div className="modal-content rounded-4 shadow-sm border-0 bg-brown-gradient-color">
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
                      <p className="mb-0">{activity.rating}/100</p>
                    </div>
                  </div>
                  {comments.length > 0 && <div className="comments p-3">
                    <div
                      className={`comments ${comments.length > 6 ? "scrollable-comments" : ""
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
                  </div>}

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


          :


          <div className="modal-content rounded-4 shadow-sm border-0 bg-brown-gradient-color" >
            <div className="modal-body p-0">
              <div className="row m-0">
                {replyComment && <div className="content-body px-web-0">
                  <div className="border-bottom">
                    <div className="d-flex justify-content-between">
                      <h5 className="mb-0 text-bold details-container">
                        Replies to
                      </h5>
                      <div className="small dropdown p-3">
                        <a
                          href="#"
                          className="text-muted text-decoration-none material-icons"
                          style={{ maxWidth: "40px" }}
                          onClick={() => setReplyModalOpen(false)}
                        >
                          arrow_back_outlined
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom p-2">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <a href="#" className="text-decoration-none">
                        <img
                          src={replyComment.user.profilePicture}
                          className="img-fluid rounded-circle m-2"
                          alt="profile-img"
                          style={{ width: "40px", height: "40px" }}
                        />
                      </a>
                      <h6 className="fw-bold text-body mb-0">
                        @{replyComment.user.username}
                      </h6>
                    </div>
                    <h6 className="ms-3 me-3 p-3 text-bold bg-glass rounded-4" style={{ minWidth: "300px" }}>
                      {(replyComment.comment)}
                    </h6>
                  </div>

                  {replies.length > 0 && <div className="comments p-3">
                    <div
                      className={`comments ${replies.length > 6 ? "scrollable-comments" : ""
                        }`}
                    >
                      {replies.map((comment) => (
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
                                  {parseComment(comment.comment)}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  comment.isLiked
                                    ? handleCommentUnlike(comment._id, true)
                                    : handleCommentLike(comment._id, true)
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
                                onClick={() => {
                                  setReplyContent(`@${comment.user.username} `);
                                  // setReplyTag(`@${comment.user.username} `);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: "0",
                                  cursor: "pointer",
                                }}
                              >
                                Reply
                              </button>

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
                  </div>}

                  <div className="mt-auto">
                    <div className="d-flex align-items-center p-2 border-top">
                      <span className="material-icons bg-transparent border-0 text-primary pe-2 md-36">
                        account_circle
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3 fw-light bg-light form-control-text"
                        placeholder="Write your reply"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <button
                        className="text-primary ps-2 text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          submitReply();
                        }}
                        style={{ background: "none", border: "none" }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
            <div className="modal-footer d-none"></div>
          </div>
        }
      </div>
    </Modal>
  );
};

export default CommentModal;
