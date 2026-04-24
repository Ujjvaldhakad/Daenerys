import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Card_gallery from '../ui/Card_gallery';
import StackedSections from '../ui/StackedSections';
import Footer from '../components/Footer';
import PageTransition from '../ui/PageTransition';
import ProductsPage from './ProductsPage';
import CartSidebar from '../components/CartSidebar';
import CheckoutPage from './CheckoutPage';
import ProfilePage from './ProfilePage';
import OrdersPage from './OrdersPage';
import TrackOrderPage from './TrackOrderPage';
import './Home.css';

const Home = () => {
    // view: 'home' | 'shop' | 'checkout' | 'profile' | 'orders' | 'track'
    const [currentView, setCurrentView] = useState('home');
    const [trackOrderId, setTrackOrderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const transitionRef = useRef(null);

    const navigateTo = (viewName, data) => {
        window.scrollTo(0, 0);
        transitionRef.current.playTransition(() => {
            setCurrentView(viewName);
            if (viewName === 'shop' && typeof data === 'string') {
                setSearchQuery(data);
            } else if (viewName === 'shop') {
                setSearchQuery('');
            }
            if (viewName === 'track' && data) setTrackOrderId(data);
            window.scrollTo(0, 0);
        });
    };

    return (
        <div>
            <PageTransition ref={transitionRef} />
            <CartSidebar onCheckoutClick={() => navigateTo('checkout')} />
            
            {currentView === 'home' && (
                <div>
                    <div><Navbar onNavigate={navigateTo} /></div>
                    <div><Card_gallery /></div>
                    <div><StackedSections onShopClick={() => navigateTo('shop')} /></div>
                    <Footer />
                </div>
            )}
            
            {currentView === 'shop' && (
                <ProductsPage 
                    onBack={() => navigateTo('home')} 
                    onBuyNow={() => navigateTo('checkout')}
                    onNavigate={navigateTo}
                    initialSearch={searchQuery}
                />
            )}

            {currentView === 'checkout' && (
                <CheckoutPage 
                    onBack={() => navigateTo('shop')} 
                    onComplete={(orderId) => navigateTo('track', orderId)}
                    onNavigate={navigateTo}
                />
            )}

            {currentView === 'profile' && (
                <ProfilePage 
                    onBack={() => navigateTo('home')}
                    onViewOrders={() => navigateTo('orders')}
                    onNavigate={navigateTo}
                />
            )}

            {currentView === 'orders' && (
                <OrdersPage
                    onBack={() => navigateTo('profile')}
                    onTrackOrder={(id) => navigateTo('track', id)}
                    onNavigate={navigateTo}
                />
            )}

            {currentView === 'track' && (
                <TrackOrderPage
                    orderId={trackOrderId}
                    onBack={() => navigateTo('orders')}
                    onNavigate={navigateTo}
                />
            )}
        </div>
    )
}

export default Home;