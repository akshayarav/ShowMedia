import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import { Tabs, Tab } from 'react-bootstrap';
import MyShows from './MyShows/MyShows';
import { useParams } from 'react-router-dom';
import MobileBar from '../MobileBar/MobileBar';


function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        Axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [username]);

    return (
        <body className="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)}/>
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div className="main-content">
                                <ul className="top-osahan-nav-tab nav nav-pills justify-content-center nav-justified mb-4 shadow-sm rounded-4 overflow-hidden bg-white mt-4" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted active" id="pills-overview-tab" data-bs-toggle="pill" data-bs-target="#pills-overview" type="button" role="tab" aria-controls="pills-overview" aria-selected="true">Overview</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted" id="pills-feed-tab" data-bs-toggle="pill" data-bs-target="#pills-feed" type="button" role="tab" aria-controls="pills-feed" aria-selected="false">Activity</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="p-3 nav-link text-muted" id="pills-shows-tab" data-bs-toggle="pill" data-bs-target="#pills-shows" type="button" role="tab" aria-controls="pills-shows" aria-selected="false">My Shows</button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-overview" role="tabpanel" aria-labelledby="pills-overview-tab">
                                        {/* Content for Overview tab */}
                                    </div>
                                    <div className="tab-pane fade" id="pills-feed" role="tabpanel" aria-labelledby="pills-feed-tab">
                                        {/* Content for Activity tab */}
                                    </div>
                                    <div className="tab-pane fade" id="pills-shows" role="tabpanel" aria-labelledby="pills-shows-tab">
                                        <MyShows />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </body>
    )
}
export default Profile