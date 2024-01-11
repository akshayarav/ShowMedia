import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/Overview/FollowButton';

function UserCard({ other_user }) {
    return (
        <Link to={`/profile/${other_user.username}`} className="text-decoration-none">
            <div className="p-3 border-bottom d-flex text-dark account-item">
                <img src={other_user.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
                <div>
                    <p className="fw-bold mb-0 pe-3 d-flex align-items-center text-light">{other_user.username}</p>
                </div>
                <FollowButton other_user={other_user} />
            </div>
        </Link>
    );
}

export default UserCard;
