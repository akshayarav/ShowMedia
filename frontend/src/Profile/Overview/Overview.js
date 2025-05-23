import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditModal from './Modals/EditModal';
import { FollowerUpdateContext } from '../../FollowerUpdateContext';
import FollowButton from './FollowButton';
import FollowersModal from './Modals/FollowersModal';
import Stats from './Stats/Stats';

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
    const [refresh, setRefresh] = useState(false)
    const toggleFollowersModal = () => {
        if (showFollowersModal === true) {
            setRefresh(!refresh)
        }
        setShowFollowersModal(!showFollowersModal);
    }
    const toggleFollowingModal = () => {
        if (showFollowingModal === true) {
            setRefresh(!refresh)
        }
        setShowFollowingModal(!showFollowingModal);
    }

    const { followerUpdate } = useContext(FollowerUpdateContext);
    const [isLoading, setIsLoading] = useState(false)

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    useEffect(() => {
        setIsLoading(true)
        setShowFollowersModal(false)
        setShowFollowingModal(false)
        const fetchData = async () => {
            try {
                const profileResponse = await axios.get(`${apiUrl}/api/user/${username}`);
                setProfileUser(profileResponse.data);

                const followingResponse = await axios.get(`${apiUrl}/api/user/following/${profileResponse.data._id}`);
                setFollowing(followingResponse.data);

                const followersResponse = await axios.get(`${apiUrl}/api/user/followers/${profileResponse.data._id}`);
                setFollowers(followersResponse.data);

            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            } finally {
                setIsLoading(false)
            }
        };


        fetchData();
    }, [username, refresh]);



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
        return (
            <div className="text-center" style={{ marginTop: '70px' }}>
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    const isAuthenticated = (username === auth_username);

    const numFollowing = profileUser.following ? profileUser.following.length : 0;
    const numFollowers = profileUser.followers ? profileUser.followers.length : 0;
    return (
        <div>
            <div className="border-bottom pb-3">
                {isAuthenticated &&
                    <h2 className="fw-bold text-white mt-3">My Profile</h2>
                }
                <div className="bg-glass rounded-4 shadow-sm profile ">
                    <div className="d-flex align-items-center px-3 pt-3">
                        <div>
                            <img src={profileUser.profilePicture} className="img-fluid rounded-circle" alt="profile-img"></img>
                        </div>
                        <div className="ms-3">
                            <h6 className="mb-0 d-flex align-items-start text-body fs-6 fw-bold">{profileUser.first} {profileUser.last} </h6>
                            <p className="text-muted mb-0">@{profileUser.username}</p>
                        </div>                    {isAuthenticated ? (
                            <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                <button onClick={toggleEditModal} className="btn btn-outline-primary btn-sm px-3 rounded-pill" htmlFor="btncheck1">Edit Profile</button>
                                {showEditModal && <EditModal closeModal={toggleEditModal} />}
                            </div>
                        ) : <div className="ms-auto btn-group" role="group" aria-label="Basic checkbox toggle button group"><FollowButton other_user={profileUser} /></div>}
                    </div>
                    <p className="text-muted mt-2 ms-3"> Joined {formatDate(profileUser.timestamp)} </p>
                    <div className="p-3">
                        <p className="mb-2 fs-6">{profileUser.bio}</p>
                        <div className="d-flex followers">
                            <div onClick={toggleFollowersModal} role="button" tabIndex="0">
                                <p className="mb-0">{numFollowers} <span className="text-muted">Followers</span></p>
                                <div className="d-flex">
                                    {followers.map(user => (
                                        <img key={user._id} src={user.profilePicture} className="img-fluid rounded-circle" alt="follower-img" />
                                    ))}
                                </div>
                            </div>
                            {showFollowersModal && <FollowersModal closeModal={toggleFollowersModal} title={"Followers"} followers={followers} />}
                            <div onClick={toggleFollowingModal} role="button" tabIndex="0">
                                <div className="ms-5 ps-5">
                                    <p className="mb-0">{numFollowing} <span className="text-muted">Following</span></p>
                                    <div className="d-flex">
                                        {following.map(user => (
                                            <img key={user._id} src={user.profilePicture} className="img-fluid rounded-circle" alt="follower-img" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showFollowingModal && <FollowersModal closeModal={toggleFollowingModal} title={"Following"} following={following} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <Stats />
                </div>
            </div>
        </div>

    )
}

export default Overview