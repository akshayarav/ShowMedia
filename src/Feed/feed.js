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
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        if (isAuthenticated && userId) {
            axios.get(`${apiUrl}/api/followingFeed/${userId}`)
                .then(response => {
                    setActivities(response.data);
                })
                .catch(error => {
                    console.error('Error fetching following feed:', error);
                });
        }
    }, [isAuthenticated, apiUrl, feedKey]);

    useEffect(() => {
        if (activities) {
            setIsLoading(false);
        }
    }, [activities]);


    const handleFeedTabClick = () => {
        setFeedKey(prevKey => prevKey + 1);
    };

    if (searchScreenOn) {
        return (<div>
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                {searchResults.map(user => (
                    <UserCard key={user._id} other_user={user} />
                ))}
            </div>
        </div>)
    }

    if (isLoading) {
        return (
            <div className="bg-brown-gradient">
                <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
                <div className="py-4">
                    <div className="container">
                        <div className="row position-relative">
                            <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                                <div className="main-content">
                                    <h2 class="fw-bold text-white mt-4">Your Feed</h2>
                                    <div class="text-center" style={{ marginTop: '70px' }}>
                                        <div class="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </main>
                            <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={handleFeedTabClick} />
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!isLoading && activities && activities.length === 0) {
        return (
            <div className="bg-brown-gradient">
                <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
                <div className="py-4">
                    <div className="container">
                        <div className="row position-relative">
                            <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                                <div className="main-content">
                                    <h2 className="fw-bold text-white mt-4">Your Feed</h2>
                                    <p>No following activity to display.</p>
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

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 border-start border-end main-center">
                            <div className="main-content">
                                <h2 class="fw-bold text-white mt-4">Your Feed</h2>
                                {isAuthenticated && activities && activities.length > 0 && (
                                    <FollowingFeed activities={activities} refresh={refresh} toggleRefresh={() => setRefresh(!refresh)}/>
                                ) }
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