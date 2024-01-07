import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditModal from './EditModal';
import { useUserContext } from '../../UserContext';

function Overview() {
    const auth_username = localStorage.getItem('username')
    const { username } = useParams();
    const { userData, updateUser } = useUserContext();
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [showEditModal, setShowEditModal] = useState(false);

    const toggleEditModal = () => setShowEditModal(!showEditModal);

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                updateUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username, apiUrl]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    const isAuthenticated = (username === auth_username);

    const numFollowing = userData.following ? userData.following.length : 0;
    const numFollowers = userData.followers ? userData.followers.length : 0;

    return (
        <div className="bg-white rounded-4 shadow-sm profile">
            <div className="d-flex align-items-center px-3 pt-3">
                <img src={userData.profilePicture} className="img-fluid rounded-circle" alt="profile-img"></img>
                <div className="ms-3">
                    <h6 className="mb-0 d-flex align-items-start text-body fs-6 fw-bold">{userData.first} {userData.last} </h6>
                    <p className="text-muted mb-0">@{userData.username}</p>
                </div>
                {isAuthenticated && (
                    <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group">
                        <button onClick={toggleEditModal} className="btn btn-outline-primary btn-sm px-3 rounded-pill" htmlFor="btncheck1">Edit Profile</button>
                        {showEditModal && <EditModal closeModal={toggleEditModal} />}
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="mb-2 fs-6">{userData.bio}</p>
                <div className="d-flex followers">
                    <div>
                        <p className="mb-0">{numFollowers} <span className="text-muted">Followers</span></p>
                        <div className="d-flex">
                            <img src="img/rmate1.jpg" className="img-fluid rounded-circle" alt="follower-img" />
                        </div>
                    </div>
                    <div className="ms-5 ps-5">
                        <p className="mb-0">{numFollowing} <span className="text-muted">Following</span></p>
                        <div className="d-flex">
                            <img src="img/rmate1.jpg" className="img-fluid rounded-circle" alt="follower-img" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        //Handle picture upload using Amazon S3, upload image to cloud which then stores in the server
    )
}

export default Overview