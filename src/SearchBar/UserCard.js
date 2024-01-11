import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/Overview/FollowButton';

function UserCard({ other_user, toggleRefresh }) {

    const handleLinkClick = (event) => {
        if (toggleRefresh) {
            event.preventDefault(); 
            toggleRefresh();
            window.location.href = `/profile/${other_user.username}`;
        }
    }
    return (
        <div className="user-card p-3 border-bottom d-flex text-dark account-item position-relative">
            <Link to={`/profile/${other_user.username}`} className="stretched-link" onClick = {handleLinkClick}/>
            <img src={other_user.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
            <div className="user-info flex-grow-1">
                <p className="fw-bold mb-0 text-light">{other_user.username}</p>
                <small className="text-muted">{other_user.first} {other_user.last}</small>
            </div>
            <div className="ms-auto">
                <div className="follow-button-position">
                    <FollowButton other_user={other_user} />
                </div>
            </div>

        </div>
    );
}

export default UserCard;
