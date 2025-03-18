import React, { createContext, useContext, useState } from 'react';

const ScrollPositionContext = createContext();

export const ScrollPositionProvider = ({ children }) => {
    const [scrollPosition, setScrollPosition] = useState(() => {
        // Attempt to get saved position from local storage
        const savedPosition = localStorage.getItem('scrollPosition');
        return savedPosition ? JSON.parse(savedPosition) : 0;
    });

    return (
        <ScrollPositionContext.Provider value={{ scrollPosition, setScrollPosition }}>
            {children}
        </ScrollPositionContext.Provider>
    );
};

export const useScrollPosition = () => useContext(ScrollPositionContext);
