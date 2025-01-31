import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loggedInEmail, setLoggedInEmail] = useState(localStorage.getItem('email'));

    const login = (token, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email)
        setIsAuthenticated(true);
        setLoggedInEmail(email)
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email')
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loggedInEmail}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);