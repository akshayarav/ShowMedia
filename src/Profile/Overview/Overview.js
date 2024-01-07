import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditModal from './EditModal';

function Overview() {
    const auth_username = localStorage.getItem('username')
    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    const [showEditModal, setShowEditModal] = useState(false);
    const toggleEditModal = () => setShowEditModal(!showEditModal);

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    const isAuthenticated = (username === auth_username)

    return (
        <div className="bg-white rounded-4 shadow-sm profile">
            <div className="d-flex align-items-center px-3 pt-3">
                <img src={user.profilePicture} class="img-fluid rounded-circle" alt="profile-img"></img>
                <div class="ms-3">
                    <h6 className="mb-0 d-flex align-items-start text-body fs-6 fw-bold">{user.first} {user.last} </h6>
                    <p className="text-muted mb-0">@{user.username}</p>
                </div>
                {isAuthenticated && (
                    <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group">
                        <button onClick={toggleEditModal} className="btn btn-outline-primary btn-sm px-3 rounded-pill" htmlFor="btncheck1">Edit Profile</button>
                        {showEditModal && <EditModal closeModal={toggleEditModal} />}
                    </div>
                )}
            </div>
            <div class="p-3">
                <p class="mb-2 fs-6">{user.bio}</p>
            </div>
        </div>
        //Handle picture upload using Amazon S3, upload image to cloud which then stores in the server
    )
}

export default Overview