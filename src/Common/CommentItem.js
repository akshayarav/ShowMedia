function CommentItem({
  comment,
  handleCommentLike,
  handleCommentUnlike,
  handleReplyLike,
  handleReplyUnlike,
  openReplyBox,
  visibleReplyBoxId,
  submitReply,
  replyContent,
  setReplyContent,
  formatTimestamp
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
                    onClick={() => openReplyBox(comment._id)}
                    style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                >
                    Reply
                </button>
                <span className="fs-3 text-muted material-icons mx-1">circle</span>
                <span className="small text-muted">{formatTimestamp(comment.timestamp)}</span>
            </div>

            {visibleReplyBoxId === comment._id && (
                <div className="d-flex align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-3 fw-light bg-glass form-control-text"
                        placeholder="Write your reply"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button
                        className="text-primary ps-2 text-decoration-none"
                        onClick={() => submitReply(comment._id)}
                        style={{ background: 'none', border: 'none' }}
                    >
                        Reply
                    </button>
                </div>
            )}

            <div className="replies-container">
                {comment.replies && comment.replies.map(reply => (
                    <div key={reply._id} className="reply mt-3">
                        <div className="d-flex">
                            <a href="#" className="text-white text-decoration-none">
                                <img src={reply.user.profilePicture} className="img-fluid rounded-circle" alt="reply-img" />
                            </a>
                            <div className="ms-2 small flex-grow-1">
                                <div className="d-flex justify-content-between bg-glass px-3 py-2 rounded-4 mb-1 chat-text">
                                    <div>
                                        <p className="fw-500 mb-0">{reply.user.username}</p>
                                        <span className="text-muted">{reply.comment}</span>
                                    </div>
                                    <button
                                        onClick={() => reply.isLiked ? handleReplyUnlike(comment._id, reply._id) : handleReplyLike(comment._id, reply._id)}
                                        className="border-0 bg-transparent align-self-start"
                                    >
                                        <span className="material-icons" style={{ fontSize: '18px' }}>
                                            {reply.isLiked ? 'favorite' : 'favorite_border'}
                                        </span>
                                    </button>
                                </div>
                                <div className="d-flex align-items-center ms-2 small">
                                    <span className="text-muted">{reply.likes.length || 0} Likes</span>
                                    <span className="fs-3 text-muted material-icons mx-1">circle</span>
                                    <button
                                        className="small text-muted text-decoration-none"
                                        onClick={() => openReplyBox(comment._id)}
                                        style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                                    >
                                        Reply
                                    </button>
                                    <span className="fs-3 text-muted material-icons mx-1">circle</span>
                                    <span className="text-muted">{formatTimestamp(reply.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default CommentItem;