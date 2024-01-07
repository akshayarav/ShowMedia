import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUserContext } from '../UserContext';

function UserCard({ other_user }) {
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [otherUser, setOtherUser] = useState(null)
    const { userData, updateUser } = useUserContext();

    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = localStorage.getItem('userId')

    //fetch the data of the user to be displayed on the card
    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${other_user}`)
            .then(response => {
                setOtherUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [apiUrl, other_user]);

    //set the value of isFollowing depending on the following list of the logged in user
    useEffect(() => {
        axios.get(`${apiUrl}/following/${userId}`)
            .then(response => {
                const isCurrentlyFollowing = response.data.some(userData => userData.username === other_user);
                setIsFollowing(isCurrentlyFollowing);
                console.log(isFollowing);
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
                updateUser(response.data);
                setIsFollowing(!isFollowing);
            })
            .catch(error => {
                console.error('Error following/unfollowing user:', error);
            });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!userData || !otherUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
            <Link to={`/profile/${other_user}`} className="text-decoration-none">
                <img src={otherUser.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
            </Link>
            <Link to={`/profile/${other_user}`} className="text-decoration-none">
                <div>
                    <p className="fw-bold mb-0 pe-3 d-flex align-items-center text-decoration-none text-dark">{otherUser.username}</p>
                </div>
            </Link>
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
        </div>
    )
}

export default UserCard