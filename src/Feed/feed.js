import Sidebar from "../Sidebar/sidebar"
import React, { useState, useEffect } from 'react';
import MobileBar from "../MobileBar/MobileBar";
import SearchBar from "../SearchBar/SearchBar";
import UserCard from "../SearchBar/UserCard";

function Feed() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);

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
        <div className="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
                            <div className="main-content">
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