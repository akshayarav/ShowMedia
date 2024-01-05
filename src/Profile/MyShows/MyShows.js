import MyShowCard from "./MyShowCard"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyShows () {
    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = localStorage.getItem('userId');
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/ratings/${userId}`);
                setRatings(response.data);
            } catch (error) {
                console.error('Error fetching ratings', error);
            }
        };

        if (userId) {
            fetchRatings();
        }
    }, [userId, apiUrl]);

    return (
        <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
            {ratings.map(rating => (
                <MyShowCard key={rating.show} rating={rating.rating} showId={rating.show} />
            ))}
        </div>
    );
}

export default MyShows;
