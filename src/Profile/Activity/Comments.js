import { useState, useEffect } from "react";
import axios from "axios";

function Comments({ activityId }) {
    const [visibleComments, setVisibleComments] = useState(1);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [comments, setComments] = useState([]);
    const [activity, setActivity] = useState('')


    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/activities/${activityId}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (activityId) {
            fetchComments();
        }
    }, [activityId]);



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
        try {
            const response = await axios.post(`${apiUrl}/api/activities/${activity._id}/comment/${commentId}/like`, { userId });
            if (response.data) {
                setComments(comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, isLiked: true, likeCount: (comment.likeCount || 0) + 1 };
                    }
                    return comment;
                }));
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleCommentUnlike = async (commentId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.post(`${apiUrl}/api/activities/${activity._id}/comment/${commentId}/unlike`, { userId });
            if (response.data) {
                setComments(comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, isLiked: false, likeCount: (comment.likeCount || 1) - 1 };
                    }
                    return comment;
                }));
            }
        } catch (error) {
            console.error('Error unliking comment:', error);
        }
    };


    return (
        <div className="comments mt-3">
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
                            <span className="text-muted mx-2">{comment.likeCount || 0} Likes</span>
                            <a href="#" className="small text-muted text-decoration-none">Reply</a>
                            <span className="fs-3 text-muted material-icons mx-1">circle</span>
                            <span className="small text-muted">{formatTimestamp(comment.timestamp)}</span>
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
    )

}

export default Comments