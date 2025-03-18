import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserCard from "./UserCard";
import { FollowerUpdateContext } from '../FollowerUpdateContext';
import { Link } from 'react-router-dom';

function SearchBar({ messages, messagesSubmit }) {
    const apiUrl = process.env.REACT_APP_API_URL
    const userId = localStorage.getItem('userId')
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recProfiles, setRecProfiles] = useState([])
    const username = localStorage.getItem('username')

    const { followerUpdate } = useContext(FollowerUpdateContext);

    useEffect(() => {
        if (searchTerm) {
            axios.get(`${apiUrl}/api/user/search?q=${searchTerm}`)
                .then(response => {
                    const filteredResults = response.data.filter(user => user._id !== userId);
                    setSearchResults(filteredResults);
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/recommendations/${username}`)
            .then(response => {
                setRecProfiles(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }, [followerUpdate]);

    if (messages) {
        return (
            <div>
                <div className="sticky-sidebar2 mb-3">
                    <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-glass">
                        <span className="input-group-text material-icons border-0 bg-transparent text-primary">search</span>
                        <input
                            type="text"
                            className="form-control border-0 fw-light bg-transparent ps-1"
                            placeholder="Find Users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {/* {searchResults.length == 0 &&
                    <div className="bg-glass rounded-4 overflow-hidden account-follow shadow-sm mb-4">
                        {recProfiles.map(user => (
                            <UserCard key={user._id} other_user={user} />
                        ))}
                        {recProfiles.length === 0 &&
                            <p className="text-muted p-3 mb-0">Follow your first account so we can find you more friends...</p>
                        }
                    </div>
                } */}
                <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                    {searchResults.map(user => (
                        <UserCard key={user._id} other_user={user} messages={true} messagesSubmit={messagesSubmit}/>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <aside className="col col-xl-3 order-xl-3 col-lg-3 order-lg-3 col-md-0 col-sm-0 search-bar-container">
            <div className="fix-sidebar">
                <div className="side-trend lg-none">
                    <div className="sticky-sidebar2 mb-3">
                        <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-glass">
                            <span className="input-group-text material-icons border-0 bg-transparent text-primary">search</span>
                            <input
                                type="text"
                                className="form-control border-0 fw-light bg-transparent ps-1"
                                placeholder="Find Users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {searchResults.length == 0 &&
                        <div className="bg-glass rounded-4 overflow-hidden account-follow shadow-sm mb-4">
                            <h6 className="fw-bold text-body p-3 mb-0 border-bottom">Other Show Lovers!</h6>
                            {recProfiles.map(user => (
                                <UserCard key={user._id} other_user={user} />
                            ))}
                            {recProfiles.length === 0 &&
                                <p className="text-muted p-3 mb-0">Follow your first account so we can find you more friends...</p>
                            }
                        </div>
                    }
                    <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                        {searchResults.map(user => (
                            <UserCard key={user._id} other_user={user} />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default SearchBar;
