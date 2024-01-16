import { useState, useEffect } from "react";
import axios from "axios";

function Comments({ activityId, refresh, toggleRefresh }) {
    const [visibleComments, setVisibleComments] = useState(1);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/activities/${activityId}/comments`);
                const updatedComments = response.data.map(comment => ({
                    ...comment,
                    isLiked: comment.likes.includes(userId)
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

    const handleCommentReply = async (commentId) => {
        const userId = localStorage.getItem('userId');
        const replyContent = prompt("Enter your reply:");

        if (replyContent) {
            try {
                const response = await axios.post(`${apiUrl}/api/activities/comment/${commentId}/reply`, {
                    userId,
                    replyContent
                });

                toggleRefresh ()
                const updatedComment = response.data;

                setComments(comments.map(comment =>
                    comment._id === commentId ? updatedComment : comment
                ));

            } catch (error) {
                console.error('Error posting reply:', error);
            }
        }
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
                                <p className="fw-500 mb-0">{comment.username}</p>
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
                            <span className="text-muted mx-2">{comment.likes.length || 0} Likes</span>
                            <button
                                className="small text-muted text-decoration-none"
                                onClick={() => handleCommentReply(comment._id)}
                                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                            >
                                Reply
                            </button>
                            <span className="fs-3 text-muted material-icons mx-1">circle</span>
                            <span className="small text-muted">{formatTimestamp(comment.timestamp)}</span>
                        </div>

                        <div className="replies-container">
                            {comment.replies && comment.replies.map(reply => (
                                <div key={reply._id} className="reply d-flex mt-3">
                                    <a href="#" className="text-white text-decoration-none">
                                        <img src={reply.profilePicture} className="img-fluid rounded-circle" alt="reply-img" style={{ width: '30px', height: '30px' }} />
                                    </a>
                                    <div className="bg-glass px-3 py-2 rounded-4 ms-2 flex-grow-1">
                                        <p className="fw-500 mb-0">{reply.username}</p>
                                        <span className="text-muted">{reply.comment}</span>
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