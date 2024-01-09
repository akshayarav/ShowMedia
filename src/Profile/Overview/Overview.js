import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditModal from './EditModal';
import { FollowerUpdateContext } from '../../FollowerUpdateContext';
import FollowButton from './FollowButton';
import FollowersModal from './FollowersModal';

function Overview() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const auth_username = localStorage.getItem('username')
    const { username } = useParams();

    const [error, setError] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    const [showEditModal, setShowEditModal] = useState(false);
    const toggleEditModal = () => setShowEditModal(!showEditModal);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const toggleFollowersModal = () => setShowFollowersModal(!showFollowersModal);
    const toggleFollowingModal = () => setShowFollowingModal(!showFollowingModal);

    const { followerUpdate } = useContext(FollowerUpdateContext);
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(true)

        const fetchData = async () => {
            try {
                const profileResponse = await axios.get(`${apiUrl}/api/user/${username}`);
                setProfileUser(profileResponse.data);

                const followingResponse = await axios.get(`${apiUrl}/following/${profileResponse.data._id}`);
                setFollowing(followingResponse.data);

                const followersResponse = await axios.get(`${apiUrl}/followers/${profileResponse.data._id}`);
                setFollowers(followersResponse.data);

            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            } finally {
                setIsLoading(false)
            }
        };


        fetchData();
    }, [username, followerUpdate]);



    useEffect(() => {
        if (followerUpdate.other_user === username || followerUpdate.auth_user === username) {
            axios.get(`${apiUrl}/api/user/${username}`)
                .then(response => {
                    setProfileUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setError(error.message || 'Error fetching user data');
                });
        }
    }, [followerUpdate]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileUser || isLoading) {
        return <div>Loading...</div>;
    }

    const isAuthenticated = (username === auth_username);

    const numFollowing = profileUser.following ? profileUser.following.length : 0;
    const numFollowers = profileUser.followers ? profileUser.followers.length : 0;

    return (
        <div className="bg-white rounded-4 shadow-sm profile">
            <div className="d-flex align-items-center px-3 pt-3">
                <img src={profileUser.profilePicture} className="img-fluid rounded-circle" alt="profile-img"></img>
                <div className="ms-3">
                    <h6 className="mb-0 d-flex align-items-start text-body fs-6 fw-bold">{profileUser.first} {profileUser.last} </h6>
                    <p className="text-muted mb-0">@{profileUser.username}</p>
                </div>
                {isAuthenticated ? (
                    <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group">
                        <button onClick={toggleEditModal} className="btn btn-outline-primary btn-sm px-3 rounded-pill" htmlFor="btncheck1">Edit Profile</button>
                        {showEditModal && <EditModal closeModal={toggleEditModal} />}
                    </div>
                ) : <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group"><FollowButton other_user={profileUser} /></div>}
            </div>
            <div className="p-3">
                <p className="mb-2 fs-6">{profileUser.bio}</p>
                <div className="d-flex followers">
                    <div onClick={toggleFollowersModal} role="button" tabIndex="0">
                        <p className="mb-0">{numFollowers} <span className="text-muted">Followers</span></p>
                        <div className="d-flex">
                            {followers.map(user => (
                                <img src={user.profilePicture} className="img-fluid rounded-circle" alt="follower-img" />
                            ))}
                        </div>
                    </div>
                    {showFollowersModal && <FollowersModal closeModal={toggleFollowersModal} title={"Followers"} followers={followers} />}
                    <div onClick={toggleFollowingModal} role="button" tabIndex="0">
                        <div className="ms-5 ps-5">
                            <p className="mb-0">{numFollowing} <span className="text-muted">Following</span></p>
                            <div className="d-flex">
                                <div className="d-flex">
                                    {following.map(user => (
                                        <img src={user.profilePicture} className="img-fluid rounded-circle" alt="follower-img" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {showFollowingModal && <FollowersModal closeModal={toggleFollowingModal} title={"Following"} following={following} />}
                </div>
            </div>
        </div>
        //Handle picture upload using Amazon S3, upload image to cloud which then stores in the server
    )
}

export default Overview