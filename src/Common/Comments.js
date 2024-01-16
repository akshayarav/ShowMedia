import { useState, useEffect } from "react";
import axios from "axios";

function Comments({ activityId, refresh, toggleRefresh }) {
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
                <div key={comment._id} className="mb-2 d-flex">
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
                                                <span className="text-muted">{formatTimestamp(reply.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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

export default Comments