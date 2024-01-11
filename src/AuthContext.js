import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (token, userId, username) => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(async response => {
                const userData = response.data;
                const followingResponse = await axios.get(`${apiUrl}/following/${userId}`);
                userData.following = followingResponse.data;    
                const followersResponse = await axios.get(`${apiUrl}/followers/${userId}`);
                userData.followers = followersResponse.data;
                localStorage.setItem('user', JSON.stringify(userData));
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
    };
    

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout , isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext
