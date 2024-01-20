import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentModal from './CommentModal';

function FeedItem({ activity, refresh, toggleRefresh }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formattedTimestamp = new Date(activity.timestamp).toLocaleString();
    const image = activity.showImage ? `https://image.tmdb.org/t/p/w500${activity.showImage}` : 'error.jpg';
    const status = activity.status === "Watching" ? `watched episode ${activity.episodes} of` :
        activity.status === "Planning" ? "is planning to watch" :
            activity.status === "Completed" ? "completed" :
                activity.status === "Dropped" ? "dropped" : "unknown";

    const username = activity.user.username;
    const first = activity.user.first;

    const [isLiked, setIsLiked] = useState(activity.likes.includes(localStorage.getItem('userId')));
    const [likeCount, setLikeCount] = useState(activity.likes.length);
    const [isModalOpen, setModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem('userId');
    const [replyContent, setReplyContent] = useState('');

    const openModal = () => {
        console.log("openModal function called");
        setModalOpen(true);
    };

    const closeModal = () => {
        console.log("closeModal function called");
        setModalOpen(false);
    };

    const handleLike = async () => {
        const userId = localStorage.getItem('userId');
        const activityId = activity._id;

        const endpoint = isLiked ? `${apiUrl}/api/activities/${activityId}/unlike` : `${apiUrl}/api/activities/${activityId}/like`;
        try {
            await axios.post(endpoint, { userId });
            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <span key={i} className="material-icons md-18">
                    {i <= rating ? 'star' : 'star_border'}
                </span>
            );
        }
        return stars;
    };

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

    const handleCommentLike = async (commentId) => {
        const userId = localStorage.getItem('userId');
        console.log('like');
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
        console.log('unlike');
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

            setReplyContent('');
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    return (
        <div className="border-bottom py-3 px-lg-3">
            <div className="bg-glass p-3 feed-item rounded-4 shadow-sm">
                <div className="d-flex">
                    <div className="me-3 image-container">
                        <img src={activity.user.profilePicture} className="img-fluid rounded-circle user-img"
                            alt="profile-img" style={{ maxWidth: '50px', height: 'auto' }} />
                    </div>
                    <div className="flex-grow-1">
                        <div key={activity._id} className="d-flex justify-content-between align-items-start text-white text-decoration-none">
                            <div className="flex-grow-1">
                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <p className="text-white mb-0">{first}</p>
                                        <p className="ms-1 text-muted mb-0">@{username}</p>
                                        <p className="text-muted ms-2 mb-0">{formattedTimestamp}</p>
                                    </div>
                                    <h6 className="text-primary">
                                        {status}
                                    </h6>
                                </div>

                                <div className="mb-2">
                                    <h5 className="mb-0">
                                        {activity.showName} - <span>Season {activity.seasonNumber}</span>
                                    </h5>
                                </div>

                                <div className="mb-4">
                                    <h6 className="mb-0 ">{renderStars(activity.rating)}</h6>
                                    ({activity.rating}/10)
                                    <p className="mb-3 mt-3">Comment: "{activity.comment}"</p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div>
                                        <button
                                            className="text-muted text-decoration-none d-flex align-items-start fw-light "
                                            onClick={(e) => { e.preventDefault(); handleLike(); }}
                                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        >
                                            <span className="material-icons md-20 me-1">{isLiked ? 'thumb_up' : 'thumb_up_off_alt'}</span>
                                            <span>{likeCount}</span>
                                        </button>
                                    </div>
                                    <div>
                                        <div onClick={openModal}
                                            className="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                className="material-icons md-20 me-2">chat_bubble_outline</span>
                                        </div>
                                        {openModal && <CommentModal
                                        image={image}
                                        activity={activity}
                                        refresh={refresh}
                                        toggleRefresh={toggleRefresh}
                                        handleCommentLike={handleCommentLike}
                                        handleCommentUnlike={handleCommentUnlike}
                                        handleReplyLike={handleReplyLike}
                                        handleReplyUnlike={handleReplyUnlike}
                                        submitReply={submitReply}
                                        replyContent={replyContent}
                                        setReplyContent={setReplyContent}
                                        isModalOpen={isModalOpen}
                                        openModal={openModal}
                                        closeModal={closeModal}
                                        formatTimestamp={formatTimestamp}/>}
                                    </div>
                                    <div>
                                        <a href="#"
                                            className="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                className="material-icons md-20 me-2">repeat</span><span>617</span></a>
                                    </div>
                                    <div>
                                        <a href="#"
                                            className="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                className="material-icons md-18 me-2">share</span><span>Share</span></a>
                                    </div>
                                </div>
                            </div>

                            <img
                                src={image}
                                className="img-fluid rounded-4 ms-3"
                                alt={activity.showName}
                                style={{ maxWidth: '100px', height: 'auto' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default FeedItem;