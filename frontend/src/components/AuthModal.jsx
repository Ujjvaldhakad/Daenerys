import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    if (!isAuthModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dummy Auth
        const userData = {
            name: isLoginView ? (formData.email.split('@')[0] || 'User') : formData.name,
            email: formData.email
        };
        login(userData);
        setIsAuthModalOpen(false);
        toast.success(`Welcome to Daenerys, ${userData.name}!`);
    };

    return (
        <div className="auth-overlay" onClick={() => setIsAuthModalOpen(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={() => setIsAuthModalOpen(false)}>&times;</button>
                
                <div className="auth-tabs">
                    <button className={isLoginView ? 'active' : ''} onClick={() => setIsLoginView(true)}>Login</button>
                    <button className={!isLoginView ? 'active' : ''} onClick={() => setIsLoginView(false)}>Register</button>
                </div>

                <div className="auth-body">
                    <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLoginView ? 'Sign in to access your bespoke collections.' : 'Join the legacy of Daenerys.'}</p>

                    <form onSubmit={handleSubmit}>
                        {!isLoginView && (
                            <input 
                                required 
                                type="text" 
                                placeholder="Full Name" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        )}
                        <input 
                            required 
                            type="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                            required 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        
                        <button type="submit" className="auth-submit-btn">
                            {isLoginView ? 'Sign In' : 'Register Now'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
