import React, { createContext, useState, useEffect } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem('daenerys-reviews');
        if (saved) {
            try { setReviews(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('daenerys-reviews', JSON.stringify(reviews));
    }, [reviews]);

    const addReview = (productId, review) => {
        setReviews(prev => {
            const existing = prev[productId] || [];
            return { ...prev, [productId]: [...existing, { ...review, id: Date.now(), date: new Date().toISOString() }] };
        });
    };

    const getReviews = (productId) => reviews[productId] || [];

    const getAverageRating = (productId) => {
        const r = reviews[productId] || [];
        if (r.length === 0) return 0;
        return (r.reduce((sum, rv) => sum + rv.rating, 0) / r.length).toFixed(1);
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, getReviews, getAverageRating }}>
            {children}
        </ReviewContext.Provider>
    );
};
