import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Add user state
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(true);

    // On component mount, check if user is already authenticated
    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userId = localStorage.getItem('userId');
                    const username = localStorage.getItem('username');
                    const userString = localStorage.getItem('user');
                    
                    if (userId && username) {
                        setIsAuthenticated(true);
                        
                        // Try to load user data from localStorage
                        if (userString) {
                            try {
                                const userData = JSON.parse(userString);
                                setUser(userData);
                            } catch (e) {
                                console.error("Error parsing user data:", e);
                                // Try to refresh user data if parse fails
                                if (username && userId) {
                                    await fetchUserData(username, userId);
                                }
                            }
                        } else if (username && userId) {
                            // If no user data in localStorage, fetch it
                            await fetchUserData(username, userId);
                        }
                    }
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeAuth();
    }, []);

    const initiateGoogleSignIn = () => {
        window.location.href = `${apiUrl}/api/auth/google`;
    };

    // Function to fetch user data
    const fetchUserData = async (username, userId) => {
        try {
            // Fetch user data
            const userResponse = await axios.get(`${apiUrl}/api/user/${username}`);
            const userData = userResponse.data;
            
            // Fetch following and followers data
            const followingResponse = await axios.get(`${apiUrl}/api/user/following/${userId}`);
            userData.following = followingResponse.data || [];
            
            const followersResponse = await axios.get(`${apiUrl}/api/user/followers/${userId}`);
            userData.followers = followersResponse.data || [];
            
            // Update state and localStorage
            setUser(userData);
            try {
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (e) {
                console.error("Error saving user data to localStorage:", e);
            }
            
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    const login = async (token, userId, username) => {
        try {
            // Set authentication info right away
            try {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);
            } catch (e) {
                console.error("Error saving auth data to localStorage:", e);
            }
            
            setIsAuthenticated(true);
            
            // Fetch user data
            const userData = await fetchUserData(username, userId);
            
            return { success: true, userData };
        } catch (error) {
            console.error('Error during login:', error);
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

                // Log the user in after registration
                const loginResult = await login(token, userId, username);
                return loginResult;
            } else {
                return { success: false, message: response.data.error || 'Registration failed.' };
            }
        } catch (error) {
            console.error('Error during registration:', error);
            return { 
                success: false, 
                message: error.response?.data?.error || 'Registration failed: ' + error.message 
            };
        }
    };
    
    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('user'); // Also remove user data
        } catch (e) {
            console.error("Error clearing localStorage:", e);
        }
        
        setUser(null);
        setIsAuthenticated(false);
    };

    // Provide the user data and additional functions in the context
    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user,
            login, 
            logout, 
            isLoading, 
            register,
            initiateGoogleSignIn,
            refreshUserData: fetchUserData // Allow components to refresh user data
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;