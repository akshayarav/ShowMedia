import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import { Tabs, Tab } from 'react-bootstrap';
import MyShows from './MyShows/MyShows';


function Profile() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [key, setKey] = useState('feed');

    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
        console.log(isOffcanvasOpen)
    };

    return (
        <body className="bg-light">
            <div className="web-none d-flex align-items-center px-3 pt-3">
                <a href="index.html" className="text-decoration-none">
                    <img src="img/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
                </a>
                <button className="ms-auto btn btn-primary ln-0" type="button" onClick={toggleOffcanvas}>
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={toggleOffcanvas} />
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