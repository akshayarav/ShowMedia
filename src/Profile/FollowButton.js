import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FollowerUpdateContext } from '../FollowerUpdateContext';

function FollowButton({other_user}) {
    const [isFollowing, setIsFollowing] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId')
    const { setFollowerUpdate } = useContext(FollowerUpdateContext);

    useEffect(() => {
        axios.get(`${apiUrl}/following/${userId}`)
            .then(response => {
                const isCurrentlyFollowing = response.data.some(userData => userData.username === other_user);
                setIsFollowing(isCurrentlyFollowing);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [apiUrl, userId]);

    const handleFollow = () => {
        const endpoint = isFollowing ? `${apiUrl}/unfollow/${other_user}` : `${apiUrl}/follow/${other_user}`;
        axios.post(endpoint, { userId: userId })
            .then(response => {
                setIsFollowing(!isFollowing);
                setFollowerUpdate({ auth_user: localStorage.getItem('username'), other_user: other_user, following: !isFollowing });
            })
            .catch(error => {
                console.error('Error following/unfollowing user:', error);
            });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="ms-auto">
            <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                    onClick={handleFollow}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            </div>
        </div>
    )
}

export default FollowButton