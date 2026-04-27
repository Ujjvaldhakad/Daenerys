import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import './AuthModal.css';
import { registerUser, loginUser } from '../apis/Apis';


const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoginView) {
                const { data } = await loginUser(formData);
                login(data.user);
                toast.success(data.message);
            } else {
                const { data } = await registerUser(formData);
                login(data.user);
                toast.success(data.message);
            }
            setIsAuthModalOpen(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
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
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        )}
                        <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            required
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
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
