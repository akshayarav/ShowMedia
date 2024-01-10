import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowingFeed from './FollowingFeed/FollowingFeed';
import Sidebar from "../Sidebar/sidebar";
import MobileBar from '../MobileBar/MobileBar';
import SearchBar from '../SearchBar/SearchBar';
import { useParams } from 'react-router-dom';

function Feed() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { username } = useParams();
    const [feedKey, setFeedKey] = useState(0);

    useEffect(() => {
        if (username) {
            axios.get(`${apiUrl}/api/user/${username}`)
                .then(response => {
                    setUserData(response.data);
                    setError(null);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setError(error.message || 'Error fetching user data');
                });
        }
    }, [username, apiUrl]);

    const handleFeedTabClick = () => {
        setFeedKey(prevKey => prevKey + 1);
    };

    return (
        <div className="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div className="main-content">
                                {error && <div className="error-message">Error: {error}</div>}
                                {userData && <FollowingFeed activities={userData.activities} refresh={feedKey} />}
                                {!username && <p>Please log in to see the feed.</p>}
                                {username && !userData && !error && <p>Loading user activities...</p>}
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={handleFeedTabClick} />
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feed;