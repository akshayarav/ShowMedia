import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ReviewCard({ review }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const reviewId = review._id;
    const userId = localStorage.getItem('userId')
    const [votesState, setVotesState] = useState(review.votes);
    const state = review.upvotes.includes(userId) ? "upvote" : review.downvotes.includes(userId) ? "downvote" : null
    const [userVote, setUserVote] = useState(state); // 'upvote', 'downvote', or null
    
    const handleVote = async (type) => {
        // Check if the user is trying to perform the same vote again
        if (userVote === type) {
            // Undo the vote
            try {
                await axios.post(`${apiUrl}/api/reviews/${reviewId}/unvote`, { userId: userId });
                setVotesState(prev => type === 'upvote' ? prev - 1 : prev + 1);
                setUserVote(null); // Reset the user's vote
            } catch (error) {
                console.error(`Error undoing vote:`, error);
            }
        } else {
            // Perform a new vote or switch the vote
            try {
                await axios.post(`${apiUrl}/api/reviews/${reviewId}/${type}`, { userId: userId });
                if (type === 'upvote') {
                    setVotesState(prev => userVote === 'downvote' ? prev + 2 : prev + 1);
                } else if (type === 'downvote') {
                    setVotesState(prev => userVote === 'upvote' ? prev - 2 : prev - 1);
                }
                setUserVote(type); // Set or switch the user's vote
            } catch (error) {
                console.error(`Error ${type === 'upvote' ? 'upvoting' : 'downvoting'}:`, error);
            }
        }
    }

    return (
        <main className="col-11 my-2">
            <div className="bg-glass rounded-4 shadow-sm p-3">
                <div className="row">
                    <div className="mb-2 col-1">
                        <Link to={`/profile/${review.username}`} className="d-flex align-items-center">
                            <img src={review.profileImg} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                            <strong>{review.username}</strong>
                        </Link>
                        <span className="badge bg-primary">{`Score: ${review.score}`}</span>
                    </div>
                    <div className="mb-2 col-9">
                        <p className="ms-5 mt-3">{review.text}</p>
                    </div>
                    <div className="d-flex align-items-end col-2">
                        <div role="button" onClick={() => handleVote('upvote')}>
                            <span className="material-icons me-2" style={{ color: userVote === 'upvote' ? 'orange' : 'white', fontSize: userVote === 'upvote' ? '22px' : '20px' }}>
                                arrow_upward
                            </span>
                        </div>
                        <div className="mb-1">{votesState}</div>
                        <div role="button" onClick={() => handleVote('downvote')}>
                            <span className="material-icons me-2 ms-2" style={{ color: userVote === 'downvote' ? 'orange' : 'white', fontSize: userVote === 'downvote' ? '22px' : '20px' }}>
                                arrow_downward
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}

export default ReviewCard;
