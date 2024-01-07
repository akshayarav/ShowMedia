import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/FollowButton';

function UserCard({ other_user }) {
    const [error, setError] = useState(null);
    const [otherUser, setOtherUser] = useState(null)

    const apiUrl = process.env.REACT_APP_API_URL;

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

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!otherUser) {
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
            <FollowButton other_user={other_user} />
        </div>
    )
}

export default UserCard