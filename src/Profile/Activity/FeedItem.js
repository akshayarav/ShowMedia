import React, { useState } from 'react';
import axios from 'axios';

function FeedItem({ activity }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formattedTimestamp = new Date(activity.timestamp).toLocaleString();
    const image = activity.showImage ? `https://image.tmdb.org/t/p/w500${activity.showImage}` : 'error.jpg';

    const status = activity.status === "Watching" ? `just watched the ${activity.episodes} episode of` :
        activity.status === "Planning" ? "is planning to watch" :
            activity.status === "Completed" ? "completed" :
                activity.status === "Dropped" ? "dropped" : "unknown";

    const username = activity.username ? activity.username : activity.user.username;
    const first = activity.first ? activity.first : activity.user.first;

    const [isLiked, setIsLiked] = useState(activity.likes.includes(localStorage.getItem('userId')));
    const [likeCount, setLikeCount] = useState(activity.likes.length);
    const [comments, setComments] = useState(activity.comments);
    const [newComment, setNewComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [visibleComments, setVisibleComments] = useState(1);

    const handleLike = async () => {
        const userId = localStorage.getItem('userId');
        const activityId = activity._id;

        try {
            const endpoint = isLiked ? `${apiUrl}/api/activities/${activityId}/unlike` : `${apiUrl}/api/activities/${activityId}/like`;
            await axios.post(endpoint, { userId });

            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

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
                setComments(prevComments => [...prevComments, response.data.newComment]);
                setNewComment('');
            } else {
                console.error('New comment structure is not as expected:', response.data);
            }
        } catch (error) {
            console.error('Error submitting new comment:', error);
        }
    };

    const toggleCommentBox = () => {
        setShowCommentBox(!showCommentBox);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
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

    const handleShowMore = () => {
        setVisibleComments(prev => prev + 3);
    };

    return (
        <div key={activity._id} className="p-3 border-bottom d-flex justify-content-between align-items-start text-white text-decoration-none">
            <div className="flex-grow-1">
                <div className="mb-2 d-flex align-items-center">
                    <small className="text-muted">@{username}</small>
                    <span className="mx-2 material-icons md-18">circle</span>
                    <small className="text-muted">{formattedTimestamp}</small>
                </div>

                <div className="mb-2">
                    <h6 className="mb-0">
                        {first} {status}
                    </h6>
                </div>

                <div className="mb-2">
                    <h5 className="mb-0">
                        {activity.showName} - <span>Season {activity.seasonNumber}</span>
                    </h5>
                </div>

                <div className="mb-2">
                    <h6 className="mb-1 fw-bold">Season Rating: {activity.rating}/10</h6>
                    <br />
                    <p className="mb-1">"{activity.comment}"</p>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <button
                        className="text-muted text-decoration-none d-flex align-items-start fw-light me-2"
                        onClick={(e) => { e.preventDefault(); handleLike(); }}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        <span className="material-icons md-20">{isLiked ? 'thumb_up' : 'thumb_up_off_alt'}</span>
                        <span>{likeCount}</span>
                    </button>
                    <span className="material-icons md-20" onClick={toggleCommentBox}>chat_bubble_outline</span>
                </div>

                {showCommentBox && (
                    <div className="d-flex align-items-center mt-3 mb-3">
                        <input
                            type="text"
                            className="test-primary form-control form-control-sm rounded-3 fw-light me-2 flex-grow-1"
                            placeholder=""
                            value={newComment}
                            onChange={handleNewCommentChange}
                            style={{ marginRight: '5px' }}
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

            <div>
                {comments.slice(0, visibleComments).map(comment => (
                    <div key={comment._id} className="mb-3">
                        <div className="bg-light px-3 py-2 rounded-4 chat-text" style={{ color: 'black' }}>
                            <p className="fw-500 mb-0">{comment.user.username}</p>
                            <span>{comment.comment}</span>
                        </div>
                        <span className="small text-muted d-block" style={{ fontSize: '0.8em' }}>{formatTimestamp(comment.timestamp)}</span>
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

                {isCommentModalOpen && (
                    <div className="modal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add a Comment</h5>
                                    <button type="button" className="close" onClick={closeCommentModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <textarea
                                        className="form-control"
                                        placeholder="Your comment"
                                        value={newComment}
                                        onChange={handleNewCommentChange}>
                                    </textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={submitComment}>Post Comment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <img
                src={image}
                className="img-fluid rounded-4 ms-3"
                alt={activity.showName}
                style={{ maxWidth: '100px', height: 'auto' }}
            />
        </div>
    );

}

export default FeedItem;