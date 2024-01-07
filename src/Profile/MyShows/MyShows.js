import MyShowCard from "./MyShowCard"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MyShows () {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { username } = useParams();
    const [ratings, setRatings] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
                fetchRatings(response.data._id);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username, apiUrl]);

    const fetchRatings = async (userId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/ratings/${userId}`);
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching ratings', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
            {ratings.map(rating => (
                <MyShowCard key={rating.show} rating={rating.rating} showId={rating.show} />
            ))}
        </div>
    );
}

export default MyShows;
