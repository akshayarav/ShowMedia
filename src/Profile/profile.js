import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import MyShows from './MyShows/MyShows';
import { useParams } from 'react-router-dom';
import MobileBar from '../MobileBar/MobileBar';
import SearchBar from '../SearchBar/SearchBar';
import Overview from './Overview/Overview';
import Feed from './Activity/Activity';
import UserCard from '../SearchBar/UserCard';

function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const { username } = useParams();
    const [error, setError] = useState(null);
    const [feedKey, setFeedKey] = useState(0);

    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);

    const handleFeedTabClick = () => {
        setFeedKey(prevKey => prevKey + 1);
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
    }, [username, apiUrl]);

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

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
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12 align-content" >
                            <div className="main-content">
                                <ul className="top-osahan-nav-tab nav nav-pills justify-content-center nav-justified mb-4 shadow-sm rounded-4 overflow-hidden bg-glass my-3 mx-lg-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted active" id="pills-overview-tab" data-bs-toggle="pill" data-bs-target="#pills-overview" type="button" role="tab" aria-controls="pills-overview" aria-selected="true">Overview</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted" id="pills-feed-tab" data-bs-toggle="pill" data-bs-target="#pills-feed" type="button" role="tab" aria-controls="pills-feed" aria-selected="false" onClick={handleFeedTabClick}>Activity</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted" id="pills-shows-tab" data-bs-toggle="pill" data-bs-target="#pills-shows" type="button" role="tab" aria-controls="pills-shows" aria-selected="false">Show List</button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab">
                                        <Overview />
                                    </div>
                                    <div className="tab-pane fade" id="pills-feed" role="tabpanel" aria-labelledby="pills-feed-tab">
                                        {userData && <Feed userId={userData._id} refresh = {feedKey}/>}
                                    </div>
                                    <div className="tab-pane fade" id="pills-shows" role="tabpanel" aria-labelledby="pills-shows-tab">
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