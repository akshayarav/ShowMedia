import Sidebar from "../Sidebar/sidebar"
import React, { useState, useEffect } from 'react';
import FeedItem from "./FeedItem/feeditem"
import MobileBar from "../MobileBar/MobileBar";
import SearchBar from "../SearchBar/SearchBar";

function Feed() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    return (
        <div className="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div className="main-content">
                                <FeedItem />
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

export default Feed