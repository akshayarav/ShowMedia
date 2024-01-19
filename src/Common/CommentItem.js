import React from 'react';
import CommentModal from './CommentModal';

function CommentItem({
  image,
  activity,
  activityId,
  refresh,
  toggleRefresh,
  comment,
  handleCommentLike,
  handleCommentUnlike,
  handleReplyLike,
  handleReplyUnlike,
  submitReply,
  replyContent,
  setReplyContent,
  formatTimestamp,
  isModalOpen={isModalOpen},
  openModal={openModal},
  closeModal={closeModal}
}) {

    return (
        <div className="mb-2 d-flex">
            <a href="#" className="text-white text-decoration-none">
                <img src={comment.profilePicture} className="img-fluid rounded-circle" alt="commenters-img" />
            </a>
            <div className="ms-2 small flex-grow-1">
                <div className="d-flex justify-content-between bg-glass px-3 py-2 rounded-4 mb-1 chat-text">
                    <div>
                        <p className="fw-500 mb-0">{comment.user.username}</p>
                        <span className="text-muted">{comment.comment}</span>
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
                        onClick={openModal}
                        style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                    >
                        Reply
                        {/*add logic here for specific reply to comment maybe*/}
                    </button>
                    <span className="fs-3 text-muted material-icons mx-1">circle</span>
                    <span className="small text-muted">{formatTimestamp(comment.timestamp)}</span>
                </div>
            </div>
            <CommentModal
                image={image}
                activity={activity}
                activityId={activityId}
                refresh={refresh}
                toggleRefresh={toggleRefresh}
                handleCommentLike={handleCommentLike}
                handleCommentUnlike={handleCommentUnlike}
                handleReplyLike={handleReplyLike}
                handleReplyUnlike={handleReplyUnlike}
                submitReply={submitReply}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                formatTimestamp={formatTimestamp}
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
            />
        </div>
    );

}

export default CommentItem;