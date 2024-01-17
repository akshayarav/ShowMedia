import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentModal = ({
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

  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('userId');
  const showImageUrl = activity.showImage ? `https://image.tmdb.org/t/p/w500${activity.showImage}` : 'error.jpg';
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
    const activityId = activity._id;

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
    <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
       <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 overflow-hidden border-0">
             <div className="modal-header d-none">
                <h5 className="modal-title" id="exampleModalLabel2">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div className="modal-body p-0">
                <div className="row m-0">
                   <div className="col-sm-7 px-0 m-sm-none">
                   <img src={showImageUrl} className="d-block w-100" alt={activity.showName} />
                   </div>
                   <div className="col-sm-5 content-body px-web-0">
                         </div>
                      </div>
                   </div>
                   <div class="col-sm-5 content-body px-web-0">
                      <div class="d-flex flex-column h-600">
                         <div class="d-flex p-3 border-bottom">
                            <img src="img/rmate4.jpg" class="img-fluid rounded-circle user-img" alt="profile-img">
                            <div class="d-flex align-items-center justify-content-between w-100">
                               <a href="profile.html" class="text-decoration-none ms-3">
                                  <div class="d-flex align-items-center">
                                     <h6 class="fw-bold text-body mb-0">iamosahan</h6>
                                     <p class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon mb-0">done</p>
                                  </div>
                                  <p class="text-muted mb-0 small">@johnsmith</p>
                               </a>
                               <div class="small dropdown">
                                  <a href="#" class="text-muted text-decoration-none material-icons ms-2 md-" data-bs-dismiss="modal">close</a>
                               </div>
                            </div>
                         </div>
                         <div className="comments p-3">
                              {comments.map(comment => (
                                <div key={comment.id} className="d-flex mb-2">
                                  <img src={comment.userImage} className="img-fluid rounded-circle" alt="profile-img" />
                                  <div className="ms-2 small">
                                    <div className="bg-light px-3 py-2 rounded-4 mb-1 chat-text">
                                      <p className="fw-500 mb-0">{comment.userName}</p>
                                      <span className="text-muted">{comment.text}</span>
                                    </div>
                                    <div className="d-flex align-items-center ms-2">
                                      <a href="#" onClick={() => handleLikeClick(comment.id)} className="small text-muted text-decoration-none">{comment.isLiked ? 'Unlike' : 'Like'}</a>
                                      <span className="fs-3 text-muted material-icons mx-1">circle</span>
                                      <a href="#" onClick={() => handleReplyClick(comment.id)} className="small text-muted text-decoration-none">Reply</a>
                                      <span className="fs-3 text-muted material-icons mx-1">circle</span>
                                      <span className="small text-muted">{comment.timeSincePosted}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                         <div class="border-top p-3 mt-auto">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                               <div>
                                  <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-20 me-2">thumb_up_off_alt</span><span>30.4k</span></a>
                               </div>
                               <div>
                                  <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-20 me-2">repeat</span><span>617</span></a>
                               </div>
                               <div>
                                  <a href="#" class="text-muted text-decoration-none d-flex align-items-start fw-light"><span class="material-icons md-18 me-2">share</span><span>Share</span></a>
                               </div>
                            </div>
                            <div class="d-flex align-items-center">
                               <span class="material-icons bg-white border-0 text-primary pe-2 md-36">account_circle</span>
                               <div class="d-flex align-items-center border rounded-4 px-3 py-1 w-100">
                                  <input type="text" class="form-control form-control-sm p-0 rounded-3 fw-light border-0" placeholder="Write Your comment">
                                  {isModalOpen && (
                                    <div className="d-flex align-items-center mb-3" >
                                        <span
                                            className="material-icons bg-transparent border-0 text-primary pe-2 md-36">account_circle</span>
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
                                )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div class="modal-footer d-none">
             </div>
          </div>
       </div>
    </div>
};

export default CommentModal;