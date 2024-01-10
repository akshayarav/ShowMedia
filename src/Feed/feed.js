import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';
import FollowingFeed from './FollowingFeed/FollowingFeed';
import Sidebar from "../Sidebar/sidebar";
import SearchBar from '../SearchBar/SearchBar';
import MobileBar from '../MobileBar/MobileBar';
import UserCard from '../SearchBar/UserCard';

function Feed() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [activities, setActivities] = useState(null);
    const [feedKey, setFeedKey] = useState(0);
    const { isAuthenticated } = useContext(AuthContext);
    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (isAuthenticated && userId) {
            // Fetch following feed using the user ID
            axios.get(`${apiUrl}/api/followingFeed/${userId}`)
                .then(response => {
                    setActivities(response.data);
                })
                .catch(error => {
                    console.error('Error fetching following feed:', error);
                });
        }
    }, [isAuthenticated, apiUrl, feedKey]);

    const handleFeedTabClick = () => {
        setFeedKey(prevKey => prevKey + 1);
    };

    if (searchScreenOn) {
        return (<div>
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                {searchResults.map(user => (
                    <UserCard key={user._id} other_user={user} />
                ))}
            </div>
        </div>)
    }

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div className="main-content">
                                {isAuthenticated && activities && activities.length > 0 ? (
                                    <FollowingFeed activities={activities} />
                                ) : (
                                    <p>No following activity to display.</p>
                                )}
                                {!isAuthenticated && <p>Please log in to see the feed.</p>}
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