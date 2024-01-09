import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/Overview/FollowButton';

function UserCard({ other_user }) {
    return (
        <div className="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
            <Link to={`/profile/${other_user.username}`} className="text-decoration-none" onClick={() => window.location.href = `/profile/${other_user.username}`}>
                <img src={other_user.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
            </Link>
            <Link to={`/profile/${other_user.username}`} className="text-decoration-none"  onClick={() => window.location.href = `/profile/${other_user.username}`}>
                <div>
                    <p className="fw-bold mb-0 pe-3 d-flex align-items-center text-decoration-none text-dark">{other_user.username} </p>
                </div>
            </Link>
            <FollowButton other_user={other_user} />
        </div>
    )
}

export default UserCard