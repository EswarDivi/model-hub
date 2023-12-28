import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const login = (userData, rememberMe) => {
        if (rememberMe) {
            // Store in localStorage for persistent sessions
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            // Store in sessionStorage for temporary sessions
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('user', JSON.stringify(userData));
        }

        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        // Clear both localStorage and sessionStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');

        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        // Check sessionStorage first, then localStorage
        const sessionLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const sessionUser = JSON.parse(sessionStorage.getItem('user'));

        if (sessionLoggedIn && sessionUser) {
            setIsLoggedIn(true);
            setUser(sessionUser);
        } else {
            const localLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const localUser = JSON.parse(localStorage.getItem('user'));

            setIsLoggedIn(localLoggedIn);
            setUser(localUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
