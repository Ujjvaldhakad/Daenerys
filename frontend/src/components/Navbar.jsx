import React, { useRef, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onNavigate }) => {
    const container = useRef(null);
    const { cartCount, toggleCart } = useContext(CartContext);
    const { isLoggedIn, toggleAuthModal, user } = useContext(AuthContext);


    useGSAP(() => {
        const tl = gsap.timeline();

        tl.fromTo('.navbar',
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
            .fromTo('.navbar-logo',
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
                '-=0.4'
            )
            .fromTo('.navbar-links .nav-item',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
                '-=0.4'
            )
            ;

    }, { scope: container });

    const handleProfileClick = () => {
        if (isLoggedIn) {
            if (onNavigate) onNavigate('profile');
        } else {
            toggleAuthModal();
        }
    };



    return (
        <div ref={container} className="navbar-container">
            <nav className="navbar">
                <div className="navbar-logo" onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon"></span>
                    <span className="logo-text">Daenerys</span>
                </div>



                <div className="navbar-links">
                    <div className="nav-item nav-orders" onClick={() => {
                        if (isLoggedIn) { if (onNavigate) onNavigate('orders'); }
                        else { toggleAuthModal(); }
                    }} style={{ cursor: 'pointer' }} title="My Orders">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
                    </div>
                    <div className="nav-item nav-cart" onClick={toggleCart} style={{ cursor: 'pointer' }} title="Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </div>
                    <div className="nav-item nav-profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }} title={isLoggedIn ? user?.name : 'Login'}>
                        {isLoggedIn ? (
                            <span className="nav-avatar">{user?.name?.charAt(0)?.toUpperCase()}</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;