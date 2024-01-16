import React, { useState } from 'react';
import axios from 'axios';
import Comments from './Comments';

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
    const [newComment, setNewComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

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

    const handleNewCommentChange = (e) => {setNewComment(e.target.value);};

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

    const toggleCommentBox = () => {setShowCommentBox(!showCommentBox);};

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
                                        <div onClick={toggleCommentBox}
                                            className="text-muted text-decoration-none d-flex align-items-start fw-light"><span
                                                className="material-icons md-20 me-2">chat_bubble_outline</span>
                                        </div>
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

                        {showCommentBox && (
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
                        <Comments activityId={activity._id} refresh={refresh} toggleRefresh={toggleRefresh}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default FeedItem;