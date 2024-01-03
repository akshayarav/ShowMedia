import Sidebar from "../Sidebar/sidebar"
import React, { useState, useEffect } from 'react';
import FeedItem from "./FeedItem/feeditem"

function Feed() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
        console.log(isOffcanvasOpen)
    };

    return (
        <body class="bg-light">
             <div className="web-none d-flex align-items-center px-3 pt-3">
                <a href="index.html" className="text-decoration-none">
                    <img src="img/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
                </a>
                <button className="ms-auto btn btn-primary ln-0" type="button" onClick={toggleOffcanvas}>
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <div class="py-4">
                <div class="container">
                    <div class="row position-relative">
                        <main class="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div class="main-content">
                               <FeedItem />
                            </div>
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={toggleOffcanvas} />
                    </div>
                </div>
            </div>
        </body>
    )
}

export default Feed