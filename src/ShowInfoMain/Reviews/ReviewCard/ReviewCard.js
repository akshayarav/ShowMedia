import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ReviewCard({ review, onVoteChange}) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const reviewId = review._id;
    const userId = localStorage.getItem('userId')
    const [votesState, setVotesState] = useState(review.votes);
    const state = review.upvotes.includes(userId) ? "upvote" : review.downvotes.includes(userId) ? "downvote" : null
    const [userVote, setUserVote] = useState(state); // 'upvote', 'downvote', or null
    
    const handleVote = async (type) => {
        let updatedReview = { ...review }; // Copy the current review object
        if (userVote === type) {
            try {
                await axios.post(`${apiUrl}/api/reviews/${reviewId}/unvote`, { userId: userId });
                updatedReview.votes = type === 'upvote' ? votesState - 1 : votesState + 1;
                setUserVote(null); // Reset the user's vote
            } catch (error) {
                console.error(`Error undoing vote:`, error);
                return; // Exit the function if there's an error
            }
        } else {
            try {
                await axios.post(`${apiUrl}/api/reviews/${reviewId}/${type}`, { userId: userId });
                updatedReview.votes = type === 'upvote' ? (userVote === 'downvote' ? votesState + 2 : votesState + 1) 
                                                        : (userVote === 'upvote' ? votesState - 2 : votesState - 1);
                setUserVote(type);
            } catch (error) {
                console.error(`Error ${type === 'upvote' ? 'upvoting' : 'downvoting'}:`, error);
                return; // Exit the function if there's an error
            }
        }
        setVotesState(updatedReview.votes); // Update local state
        onVoteChange(updatedReview); // Call onVoteChange with the updated review
    }
    

    return (
        <main className="col-11 my-2">
            <div className="bg-glass rounded-4 shadow-sm p-3">
                <div className="row">
                    <div className="mb-2 col-1">
                        <Link to={`/profile/${review.username}`} className="d-flex align-items-center" style={{ textDecoration: 'none', color: 'inherit' }} >
                            <img src={review.profileImg} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                            <strong>{review.username}</strong>
                        </Link>
                        <span className="badge bg-primary mt-3">{`Score: ${review.score}`}</span>
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
