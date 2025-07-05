import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

export const NavigationProvider = ({ children }) => {
    const [isUserMode, setIsUserMode] = useState(false);

    const toggleMode = () => {
        setIsUserMode(!isUserMode);
    };

    const value = {
        isUserMode,
        setIsUserMode,
        toggleMode
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}; 