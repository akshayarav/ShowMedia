import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const CommentModal = ({
  image,
  activityId,
  refresh,
  toggleRefresh,
  handleCommentLike,
  handleCommentUnlike,
  handleReplyLike,
  handleReplyUnlike,
  submitReply,
  replyContent,
  setReplyContent,
  formatTimestamp,
  isModalOpen,
  openModal,
  closeModal }) => {

  console.log("Rendering CommentModal, isModalOpen:", isModalOpen);

  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('userId');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      if (!activityId || !isModalOpen) return;

      try {
        const response = await axios.get(`${apiUrl}/api/activities/${activityId}/comments`);
        const updatedComments = response.data.map(comment => ({
            ...comment,
            isLiked: comment.likes.includes(userId),
            replies: comment.replies.map(reply => ({
                ...reply,
                isLiked: reply.likes.includes(userId)
            }))
        }));
        setComments(updatedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [activityId, isModalOpen, refresh, apiUrl, userId]);

  if (!isModalOpen) return null;

  const submitComment = async () => {
    const userId = localStorage.getItem('userId');

    if (!newComment.trim()) {
        console.error('Cannot submit empty comment');
        return;
    }

    try {
        const response = await axios.post(`${apiUrl}/api/activities/${activityId}/comment`, { userId, comment: newComment });

        if (response.data && response.data.newComment) {
            setNewComment('');
        } else {
            console.error('New comment structure is not as expected:', response.data);
        }
    } catch (error) {
        console.error('Error submitting new comment:', error);
    } finally {
        toggleRefresh ();
    }
  };

  const handleNewCommentChange = (e) => {setNewComment(e.target.value)};

  const handleLikeClick = (commentId, isReply = false) => {
    if (isReply) {
      handleReplyLike(commentId);
    } else {
      handleCommentLike(commentId);
    }
  };

  const handleUnlikeClick = (commentId, isReply = false) => {
    if (isReply) {
      handleReplyUnlike(commentId);
    } else {
      handleCommentUnlike(commentId);
    }
  };

  const handleReplyClick = (commentId, replyText) => {
    submitReply(commentId, replyText);
  };

  return (
    <Modal show={true} onHide={closeModal} centered className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 overflow-hidden border-0">
                <div className="modal-header d-none">
                    <h5 className="modal-title" id="exampleModalLabel2">Modal title</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body p-0">
                    <div className="row m-0">
                        <div className="col-sm-7 px-0 m-sm-none">
                            {/* Single Image Placeholder */}
                            <div className="single-image-placeholder">
                                <img src={image} className="d-block w-100" alt="Placeholder" />
                            </div>
                        </div>
                        <div className="col-sm-5 content-body px-web-0">
                            <div className="d-flex flex-column h-600">
                                <div className="d-flex p-3 border-bottom">
                                    <img src="img/rmate4.jpg" className="img-fluid rounded-circle user-img" alt="profile-img" />
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <a href="profile.html" className="text-decoration-none ms-3">
                                            <div className="d-flex align-items-center">
                                                <h6 className="fw-bold text-body mb-0">iamosahan</h6>
                                                <p className="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon mb-0">done</p>
                                            </div>
                                            <p className="text-muted mb-0 small">@johnsmith</p>
                                        </a>
                                        <div className="small dropdown">
                                            <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" data-bs-dismiss="modal">close</a>
                                        </div>
                                    </div>
                                </div>
                                {/* Comments Section - Dynamically generated comments go here */}
                                <div className="comments p-3">
                                    {/* Dynamic Comments will be injected here */}
                                </div>
                                {/* Comment Post Functionality */}
                                <div className="border-top p-3 mt-auto">
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="material-icons bg-transparent border-0 text-primary pe-2 md-36">account_circle</span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm rounded-3 fw-light bg-glass form-control-text"
                                            placeholder="Write your comment"
                                            value={newComment}
                                            onChange={handleNewCommentChange}
                                        />
                                        <button
                                            className="text-primary ps-2 text-decoration-none"
                                            onClick={(e) => { e.preventDefault(); submitComment(); }}
                                            style={{ background: 'none', border: 'none' }}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer d-none">
                </div>
            </div>
        </div>
    </Modal>
);
}

export default CommentModal;