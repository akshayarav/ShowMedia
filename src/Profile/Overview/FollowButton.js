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

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const isCurrentlyFollowing = user.following.some(userData => userData.username === other_user.username);
        setIsFollowing(isCurrentlyFollowing);
    }, [apiUrl, userId, followerUpdate, other_user]);

    const handleFollow = (e) => {
        e.stopPropagation();
        if (isFollowing) {
            user.following = user.following.filter(userData => userData.username !== other_user.username);
        }
        else {
            user.following.push({ username: other_user.username, _id: other_user._id });
        }

        localStorage.setItem('user', JSON.stringify(user));


        const newFollowingStatus = !isFollowing;
        setIsFollowing(newFollowingStatus);

        const endpoint = newFollowingStatus ? `${apiUrl}/follow/${other_user.username}` : `${apiUrl}/unfollow/${other_user.username}`;

        axios.post(endpoint, { userId: userId })
            .then(response => {
                setFollowerUpdate({ auth_user: localStorage.getItem('username'), other_user: other_user.username, following: newFollowingStatus });
            })
            .catch(error => {
                console.error('Error following/unfollowing user:', error);
                setIsFollowing(!newFollowingStatus);
            })
    };


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={handleFollow}>
                {isLoading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
            </button>
        </div>
    )
}

export default FollowButton