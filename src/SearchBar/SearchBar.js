import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from "./UserCard";

function SearchBar() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const debounceTimeout = 500; // milliseconds

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                axios.get(`${apiUrl}/api/search/users?q=${searchTerm}`)
                    .then(response => {
                        setSearchResults(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                    });
            } else {
                setSearchResults([]);
            }
        }, debounceTimeout);

        return () => clearTimeout(timeoutId); // Cleanup function to cancel the timeout
    }, [searchTerm, apiUrl]);

    return (
        <aside className="col col-xl-3 order-xl-3 col-lg-6 order-lg-3 col-md-6 col-sm-6 col-12">
            <div className="fix-sidebar">
                <div className="side-trend lg-none">
                    <div className="sticky-sidebar2 mb-3">
                        <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-white">
                            <span className="input-group-text material-icons border-0 bg-white text-primary">search</span>
                            <input 
                                type="text" 
                                className="form-control border-0 fw-light ps-1" 
                                placeholder="Find Users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                        {searchResults.map(user => (
                            <UserCard key={user._id} username={user.username} />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default SearchBar;
