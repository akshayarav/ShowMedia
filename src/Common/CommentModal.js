import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const CommentModal = ({
  image,
  activity,
  refresh,
  toggleRefresh,
  handleCommentLike,
  handleCommentUnlike,
  handleReplyLike,
  handleReplyUnlike,
  submitReply,
  replyContent,
  setReplyContent,
  isModalOpen,
  openModal,
  closeModal,
  formatTimestamp }) => {

  console.log("Rendering CommentModal, isModalOpen:", isModalOpen);

  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('userId');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const activityId = activity._id;

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
  }, [activityId, isModalOpen, comments, refresh, apiUrl, userId]);

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

  const handleReplyClick = (commentId, replyText) => {
    submitReply(commentId, replyText);
  };

  return (
    <Modal show={true} onHide={closeModal} centered className="modal fade modal-lg">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 overflow-hidden border-0">
          <div className="modal-header d-none">
            <h5 className="modal-title" id="exampleModalLabel2">Modal title</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-0">
            <div className="row m-0">
              <div className="col-sm-7 px-0 m-sm-none">
                <div className="single-image-placeholder">
                  <img src={image} className="d-block w-100" alt="Placeholder" />
                </div>
              </div>
              <div className="col-sm-5 content-body px-web-0">
                <div className="d-flex flex-column h-600">
                  <div className="d-flex p-3 border-bottom">
                    <a href="#" className="text-decoration-none">
                      <img src={activity.user.profilePicture} className="img-fluid rounded-circle" alt="profile-img" style={{ width: '40px', height: '40px' }} />
                    </a>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <a href="profile.html" className="text-decoration-none ms-3">
                        <div className="d-flex align-items-center">
                          <h6 className="fw-bold text-body mb-0">{activity.user.first}</h6>
                          <p className="ms-2 material-icons p-0 md-16 fw-bold text-white rounded-circle ov-icon mb-0">done</p>
                        </div>
                        <p className="text-muted mb-0 small">@{activity.user.username}</p>
                      </a>
                      <div className="small dropdown">
                        <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                      </div>
                    </div>
                  </div>
                  {/* Comments Section - Dynamically generated comments go here */}
                  <div className="comments p-3">
                    {comments.map(comment => (
                      <div key={comment._id} className="mb-2 d-flex">
                        <a href="#" className="text-white text-decoration-none">
                          <img src={comment.user.profilePicture} className="img-fluid rounded-circle" alt="commenters-img" />
                        </a>
                        <div className="ms-2 small flex-grow-1">
                          <div className="d-flex justify-content-between bg-glass px-3 py-2 rounded-4 mb-1 comment-box">
                            <div>
                              <p className="fw-500 mb-0 comment-text">{comment.user.username}</p>
                              <span className="text-muted comment-text">{comment.comment}</span>
                            </div>
                            <button
                              onClick={() => comment.isLiked ? handleCommentUnlike(comment._id) : handleCommentLike(comment._id)}
                              className="border-0 bg-transparent align-self-start"
                            >
                              <span className="material-icons" style={{ fontSize: '18px' }}>
                                {comment.isLiked ? 'favorite' : 'favorite_border'}
                              </span>
                            </button>
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <span className="text-muted">{comment.likes.length || 0} Likes</span>
                            <span className="fs-3 text-muted material-icons mx-1">circle</span>
                            <button
                              className="small text-muted text-decoration-none"
                              onClick={() => handleReplyClick(comment._id, replyContent)}
                              style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                            >
                              Reply
                            </button>
                            <span className="fs-3 text-muted material-icons mx-1">circle</span>
                            <span className="small text-muted">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Comment Post Functionality */}
                  <div className="border-top p-3 mt-auto">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-icons bg-transparent border-0 text-primary pe-2 md-36">account_circle</span>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3 fw-light bg-light form-control-text"
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
          <div className="modal-footer d-none"></div>
        </div>
      </div>
    </Modal>
  );
}

export default CommentModal;