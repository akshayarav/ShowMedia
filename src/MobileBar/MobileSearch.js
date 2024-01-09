
import { useState, useEffect } from 'react';
import UserCard from '../SearchBar/UserCard';
import axios from 'axios';

function MobileSearch({toggleSearchScreen, setSearchResults}) {
    const apiUrl = process.env.REACT_APP_API_URL
    const userId = localStorage.getItem('userId')
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchTerm) {
            toggleSearchScreen(true);
            axios.get(`${apiUrl}/api/search/users?q=${searchTerm}`)
                .then(response => {
                    const filteredResults = response.data.filter(user => user._id !== userId);
                    setSearchResults(filteredResults);
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        } else {
            toggleSearchScreen(false);
            setSearchResults([]);
        }
    }, [searchTerm]);

    return (
        <div  className="ms-auto web-none d-flex justify-content-center">
            <div className="input-group shadow-sm rounded-4 overflow-hidden py-2 bg-white">
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
    )
}

export default MobileSearch