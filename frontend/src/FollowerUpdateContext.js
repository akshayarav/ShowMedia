// FollowerUpdateContext.js
import React, { createContext, useState } from 'react';

export const FollowerUpdateContext = createContext();

export const FollowerUpdateProvider = ({ children }) => {
    const [followerUpdate, setFollowerUpdate] = useState({});

    return (
        <FollowerUpdateContext.Provider value={{ followerUpdate, setFollowerUpdate }}>
            {children}
        </FollowerUpdateContext.Provider>
    );
};
