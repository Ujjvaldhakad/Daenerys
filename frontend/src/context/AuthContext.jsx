import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('daenerys-user');
        if (saved) {
            setIsLoggedIn(true);
            try { setUser(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('daenerys-user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('daenerys-user');
    };

    const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, user, login, logout, 
            isAuthModalOpen, setIsAuthModalOpen, toggleAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};
