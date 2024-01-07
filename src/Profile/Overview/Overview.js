import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Overview () {
    const username = localStorage.getItem('username')

    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    const profilePicture = userData.profilePicture
    console.log("PROFILE" + profilePicture)

    return (
        <img src={profilePicture} class="img-fluid rounded-circle" alt="profile-img"></img>
        //Handle picture upload using Amazon S3, upload image to cloud which then stores in the server
    )
}

export default Overview