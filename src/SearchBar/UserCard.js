import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../Profile/Overview/FollowButton';
import axios from 'axios';


function UserCard({ other_user: initialOtherUser, toggleRefresh, username, messages, messagesSubmit }) {
    const [otherUser, setOtherUser] = useState(initialOtherUser);
    const [followedBy, setFollowedBy] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLinkClick = (event) => {
        event.stopPropagation()
        if (messages) {
            event.preventDefault();
            console.log(otherUser)
            messagesSubmit(otherUser);
        }
        if (toggleRefresh) {
            event.preventDefault();
            toggleRefresh();
            window.location.href = `/profile/${otherUser.username}`;
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/user/${username}`);
                setOtherUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error appropriately
            }
        };

        if (!initialOtherUser && username) {
            fetchUserData();
        }
    }, [username, initialOtherUser]);

    useEffect(() => {
        if (otherUser?.common_followers) {
            const followedByContent = (
                <div>
                    <small className="text-muted">Followed by: </small>
                    {otherUser.common_followers.slice(0, 3).map((user, index, array) => (
                        <span key={user}>
                            <small className="text-muted">@{user}</small>
                            {index < array.length - 1 && <small className="text-muted">, </small>}
                        </span>
                    ))}
                </div>
            );
            setFollowedBy(followedByContent);
        }
    }, [otherUser?.common_followers]);

    if (!otherUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="border-bottom z-bottom">
            <div className="user-card p-3  d-flex text-dark account-item position-relative">
                <Link to={`/profile/${otherUser.username}`} className="stretched-link" onClick={handleLinkClick} />
                <img src={otherUser.profilePicture} className="img-fluid rounded-circle me-3" alt="profile-img" style = {{width: "50px", height: "50px"}}/>
                <div className="user-info flex-grow-1">
                    <p className="fw-bold mb-0 text-light">@{otherUser.username}</p>
                    <small className="text-muted">{otherUser.first} {otherUser.last}</small>

                </div>
                <div className="ms-auto">
                    <div className="follow-button-position">
                        <FollowButton other_user={otherUser} />
                    </div>
                </div>

            </div>
            {otherUser.common_followers &&
                <div className="m-2">
                    {followedBy}
                </div>
            }
        </div>

    );
}

export default UserCard;
