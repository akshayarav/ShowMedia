import { useState, useEffect } from "react";
import axios from "axios";

function CommentsList({ activityId, refresh, toggleRefresh }) {
    const [visibleComments, setVisibleComments] = useState(1);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem('userId')
    const [visibleReplyBoxId, setVisibleReplyBoxId] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
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

        if (activityId) {
            fetchComments();
        }
    }, [activityId, refresh]);

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


    const handleShowMore = () => { setVisibleComments(prev => prev + 3); };

    const handleCommentLike = async (commentId) => {
        const userId = localStorage.getItem('userId');
        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                return { ...comment, isLiked: true,  likes: [...comment.likes, userId] }
            }
            return comment;
        }));

        try {
            await axios.post(`${apiUrl}/api/activities/comment/${commentId}/like`, { userId });
        } catch (error) {
            console.error('Error liking comment:', error);
            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return { ...comment, isLiked: false, likeCount: (comment.likeCount || 1) - 1, likes: comment.likes.filter(id => id !== userId) };
                }
                return comment;
            }));
        }
    };

    const handleCommentUnlike = async (commentId) => {
        const userId = localStorage.getItem('userId');
        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                return { ...comment, isLiked: false, likes: comment.likes.filter(id => id !== userId) };
            }
            return comment;
        }));

        try {
            await axios.post(`${apiUrl}/api/activities/comment/${commentId}/unlike`, { userId });
        } catch (error) {
            console.error('Error unliking comment:', error);
            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return { ...comment, isLiked: true, likeCount: (comment.likeCount || 0) + 1, likes: [...comment.likes, userId] };
                }
                return comment;
            }));
        }
    };

    const handleReplyLike = async (commentId, replyId) => {
        const userId = localStorage.getItem('userId');

        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply._id === replyId ? { ...reply, isLiked: true, likes: [...reply.likes, userId] } : reply
                    )
                };
            }
            return comment;
        }));

        try {
            await axios.post(`${apiUrl}/api/activities/comment/${commentId}/reply/${replyId}/like`, { userId });
        } catch (error) {
            console.error('Error liking reply:', error);
            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply._id === replyId ? { ...reply, isLiked: false, likes: reply.likes.filter(id => id !== userId) } : reply
                        )
                    };
                }
                return comment;
            }));
        }
    };

    const handleReplyUnlike = async (commentId, replyId) => {
        const userId = localStorage.getItem('userId');

        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply._id === replyId ? { ...reply, isLiked: false, likes: reply.likes.filter(id => id !== userId) } : reply
                    )
                };
            }
            return comment;
        }));

        try {
            await axios.post(`${apiUrl}/api/activities/comment/${commentId}/reply/${replyId}/unlike`, { userId });
        } catch (error) {
            console.error('Error unliking reply:', error);
            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply._id === replyId ? { ...reply, isLiked: true, likes: [...reply.likes, userId] } : reply
                        )
                    };
                }
                return comment;
            }));
        }
    };

    const submitReply = async (commentId) => {
        if (!replyContent.trim()) {
            console.error('Cannot submit empty reply');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post(`${apiUrl}/api/activities/comment/${commentId}/reply`, {
                userId,
                replyContent
            });

            toggleRefresh();
            setComments(comments.map(comment =>
                comment._id === commentId ? response.data : comment
            ));

            setVisibleReplyBoxId(null);
            setReplyContent('');
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const openReplyBox = (commentId) => {
        setVisibleReplyBoxId(commentId);
        setReplyContent('');
    };

    return (
      <div className="comments mt-4">
          {comments.slice(0, visibleComments).map(comment => (
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
          {comments.length > visibleComments && (
              <button
                  onClick={handleShowMore}
                  className="text-primary text-decoration-none"
                  style={{ background: 'none', border: 'none', padding: '3px', cursor: 'pointer' }}
              >
                  Show More
              </button>
          )}
      </div>
  );
}

export default CommentsList;