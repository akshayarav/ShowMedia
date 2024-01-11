import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/Overview/FollowButton';

function UserCard({ other_user, toggleRefresh }) {
    const [followedBy, setFollowedBy] = useState(null)

    const handleLinkClick = (event) => {
        if (toggleRefresh) {
            event.preventDefault();
            toggleRefresh();
            window.location.href = `/profile/${other_user.username}`;
        }
    }

    useEffect(() => {
        if (other_user.common_followers) {
            const followedByContent = (
                <div>
                    <small className="text-muted">Followed by: </small>
                    {other_user.common_followers.slice(0, 3).map((user, index, array) => (
                        <span key={user}>
                            <small className="text-muted">@{user}</small>
                            {index < array.length - 1 && <small className="text-muted">, </small>}
                        </span>
                    ))}
                </div>
            );
            setFollowedBy(followedByContent);
        }
    }, [other_user.common_followers]);


    return (
        <div className="border-bottom">
            <div className="user-card p-3  d-flex text-dark account-item position-relative">
                <Link to={`/profile/${other_user.username}`} className="stretched-link" onClick={handleLinkClick} />
                <img src={other_user.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" />
                <div className="user-info flex-grow-1">
                    <p className="fw-bold mb-0 text-light">@{other_user.username}</p>
                    <small className="text-muted">{other_user.first} {other_user.last}</small>

                </div>
                <div className="ms-auto">
                    <div className="follow-button-position">
                        <FollowButton other_user={other_user} />
                    </div>
                </div>

            </div>
            {other_user.common_followers &&
                <div className="m-2">
                    {followedBy}
                </div>
            }
        </div>

    );
}

export default UserCard;
