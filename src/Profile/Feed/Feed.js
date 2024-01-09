import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedItem from './FeedItem';

function Feed({ userId }) {
    const [activities, setActivities] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/activities/${userId}`);
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [userId]);

    return (
        <div>
            {activities.length > 0 ? activities.map((activity, index) => (
                <FeedItem key = {index} activity={activity} index = {index} />
            )) : <p>No recent activities.</p>}
        </div>
    );
}

export default Feed;