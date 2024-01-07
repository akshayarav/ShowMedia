import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FollowerUpdateContext } from '../../FollowerUpdateContext';

function FollowButton({ other_user }) {
    const [isFollowing, setIsFollowing] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId')
    const { followerUpdate, setFollowerUpdate } = useContext(FollowerUpdateContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${apiUrl}/following/${userId}`)
            .then(response => {
                const isCurrentlyFollowing = response.data.some(userData => userData.username === other_user);
                setIsFollowing(isCurrentlyFollowing);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [apiUrl, userId, followerUpdate]);


    const handleFollow = () => {
        if (isLoading) {
            return; 
        }

        const newFollowingStatus = !isFollowing;
        setIsFollowing(newFollowingStatus);  // Optimistically update the UI

        const endpoint = newFollowingStatus ? `${apiUrl}/follow/${other_user}` : `${apiUrl}/unfollow/${other_user}`;

        axios.post(endpoint, { userId: userId })
            .then(response => {
                setFollowerUpdate({ auth_user: localStorage.getItem('username'), other_user: other_user, following: newFollowingStatus });
            })
            .catch(error => {
                console.error('Error following/unfollowing user:', error);
                setIsFollowing(!newFollowingStatus);  // Revert on error
            })
            .finally(() => {
                setIsLoading(false);  // Stop loading regardless of result
            });
    };


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="ms-auto">
            <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={handleFollow}>
                    {isLoading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                </button>
            </div>
        </div>
    )
}

export default FollowButton