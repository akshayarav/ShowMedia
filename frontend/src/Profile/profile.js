import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import MyShows from './MyShows/MyShows';
import { useParams } from 'react-router-dom';
import MobileBar from '../MobileBar/MobileBar';
import SearchBar from '../SearchBar/SearchBar';
import Overview from './Overview/Overview';
import Activity from './Activity/Activity';
import UserCard from '../SearchBar/UserCard';

function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const { username } = useParams();
    const [error, setError] = useState(null);
    const [refresh, toggleRefresh] = useState(false);

    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);

    const [activeTab, setActiveTab] = useState('overview');

    const handleActivityTabClick = () => {
        toggleRefresh (!refresh);
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username, apiUrl, refresh]);

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (searchScreenOn) {
        return (<div>
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                {searchResults.map(user => (
                    <UserCard key={user._id} other_user={user} toggleRefresh={() => toggleRefresh(!refresh)} />
                ))}
            </div>
        </div>)
    }

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row justify-content-center ">
                        <main className="col col-xl-6 order-xl-2 col-lg-9 col-md-12 col-sm-12 col-12 main-center border-start border-end" >
                            <div className="main-content">
                                    <ul className="top-osahan-nav-tab nav nav-pills justify-content-center nav-justified mb-4 shadow-sm rounded-4 overflow-hidden bg-glass my-3 mx-lg-3" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`p-3 nav-link text-muted ${activeTab === 'overview' ? 'active' : ''}`}
                                                id="pills-overview-tab"
                                                type="button"
                                                onClick={() => setActiveTab('overview')}>
                                                Overview
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`p-3 nav-link text-muted ${activeTab === 'feed' ? 'active' : ''}`}
                                                id="pills-feed-tab"
                                                type="button"
                                                onClick={() => {
                                                    handleActivityTabClick();
                                                    setActiveTab('feed');
                                                }}>
                                                Activity
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`p-3 nav-link text-muted ${activeTab === 'shows' ? 'active' : ''}`}
                                                id="pills-shows-tab"
                                                type="button"
                                                onClick={() => setActiveTab('shows')}>
                                                Show List
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`} id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab">
                                            <Overview />
                                        </div>
                                        <div className={`tab-pane fade ${activeTab === 'feed' ? 'show active' : ''}`} id="pills-feed" role="tabpanel" aria-labelledby="pills-feed-tab">
                                            {userData && <Activity userId={userData._id} refresh={refresh} toggleRefresh={toggleRefresh} />}
                                        </div>
                                        <div className={`tab-pane fade ${activeTab === 'shows' ? 'show active' : ''}`} id="pills-shows" role="tabpanel" aria-labelledby="pills-shows-tab">
                                            <MyShows />
                                        </div>
                                    </div>
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;