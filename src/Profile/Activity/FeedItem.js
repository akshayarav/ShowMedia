import React, { useState } from 'react';
import axios from 'axios';

function FeedItem({ activity }) {
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
    const [comments, setComments] = useState(activity.comments);
    const [newComment, setNewComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
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

    const formatTimestamp = (timestamp) => {
        if (timestamp) {
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
        }
        return "0s"
    };

    const handleShowMore = () => {
        setVisibleComments(prev => prev + 3);
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

                                <div class="d-flex align-items-center justify-content-between mb-2">
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
                                        <div onClick={toggleCommentBox}
                                            class="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                class="material-icons md-20 me-2">chat_bubble_outline</span>
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#"
                                            class="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                class="material-icons md-20 me-2">repeat</span><span>617</span></a>
                                    </div>
                                    <div>
                                        <a href="#"
                                            class="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                class="material-icons md-18 me-2">share</span><span>Share</span></a>
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

                        {showCommentBox && (
                            <div class="d-flex align-items-center mb-3" >
                                <span
                                    class="material-icons bg-transparent border-0 text-primary pe-2 md-36">account_circle</span>
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

                        <div className="comments mt-3 ">
                            {comments.slice(0, visibleComments).map(comment => (
                                <div key={comment._id} className="mb-2 d-flex">
                                    <a href="#" class="text-white text-decoration-none">
                                        <img src={comment.profilePicture} class="img-fluid rounded-circle"
                                            alt="commenters-img" />
                                    </a>
                                    <div class="ms-2 small">
                                        <a href="#" class="text-white text-decoration-none"
                                            data-bs-toggle="modal" data-bs-target="#commentModal">
                                            <div class="bg-glass px-3 py-2 rounded-4 mb-1 chat-text">
                                                <p class="fw-500 mb-0">{comment.username}</p>
                                                <span class="text-muted">{comment.comment}</span>
                                            </div>
                                        </a>
                                        <div class="d-flex align-items-center ms-2">
                                            <a href="#"
                                                class="small text-muted text-decoration-none">Like</a>
                                            <span
                                                class="fs-3 text-muted material-icons mx-1">circle</span>
                                            <a href="#"
                                                class="small text-muted text-decoration-none">Reply</a>
                                            <span
                                                class="fs-3 text-muted material-icons mx-1">circle</span>
                                            <span class="small text-muted">{formatTimestamp(comment.timestamp)}</span>
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


                    </div>
                </div>
            </div>
        </div>
    );

}

export default FeedItem;