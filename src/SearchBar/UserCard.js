import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserCard({ username }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
            <Link to={`/profile/${username}`} className="text-decoration-none">
                <img src={userData.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
            </Link>
            <Link to={`/profile/${username}`} className="text-decoration-none">
                <div>
                    <p className="fw-bold mb-0 pe-3 d-flex align-items-center"><a className="text-decoration-none text-dark">{userData.username}</a></p>
                </div>
            </Link>
            <div className="ms-auto">
                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                    <input type="checkbox" className="btn-check" id="btncddheck8" />
                    <label className="btn btn-outline-primary btn-sm px-3 rounded-pill" for="btncddheck8"><span className="follow">Follow</span><span className="following d-none">Following</span></label>
                </div>
            </div>
        </div>
    )
}

export default UserCard