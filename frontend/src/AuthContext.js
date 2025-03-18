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

    const login = async (token, userId, username) => {
        try {
            // Set authentication info right away
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            setIsAuthenticated(true);
            
            // Then fetch user data
            const userResponse = await axios.get(`${apiUrl}/api/user/${username}`);
            const userData = userResponse.data;
            
            // Fetch following and followers data
            const followingResponse = await axios.get(`${apiUrl}/following/${userId}`);
            userData.following = followingResponse.data;    
            
            const followersResponse = await axios.get(`${apiUrl}/followers/${userId}`);
            userData.followers = followersResponse.data;
            
            // Store complete user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            return { success: true, userData };
        } catch (error) {
            console.error('Error during login:', error);
            // You might want to consider cleaning up partially stored data on error
            return { success: false, error: error.message };
        }
    };

    const register = async (email, username, password, first, last) => {
        try {
            const response = await axios.post(`${apiUrl}/api/auth/register`, {
                email, username, password, first, last
            });


            if (response.status === 201) {
                const { token, userId } = response.data;

                // Optionally you can log the user in after registration
                login(token, userId, username);

                // You might want to return some value or state to indicate success
                return { success: true };
            } else {
                // Handle non-successful responses
                return { success: false, message: response.data.error || 'Registration failed.' };
            }
        } catch (error) {
            console.error('Error during registration:', error);
            console.log('${apiUrl}');
            return { success: false, message: error.response.data.error };
        }
    };
    

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout , isLoading, register}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext
