import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import './OrdersPage.css';

const OrdersPage = ({ onBack, onTrackOrder, onNavigate }) => {
    const { orders } = useContext(OrderContext);

    return (
        <div className="orders-page">
            <Navbar onNavigate={onNavigate} />
            <div className="orders-container">
                <button className="back-btn" onClick={onBack}>&larr; Back</button>
                <h1>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Your order history will appear here once you make a purchase.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-id">{order.id}</span>
                                        <span className="order-date">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <span className={`order-status status-${order.statusIndex}`}>{order.status}</span>
                                </div>
                                <div className="order-items-preview">
                                    {order.items.slice(0, 3).map(item => (
                                        <img key={item.id} src={item.image} alt={item.name} />
                                    ))}
                                    {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                                </div>
                                <div className="order-card-footer">
                                    <span className="order-total">${order.total.toLocaleString()}</span>
                                    <button className="track-btn" onClick={() => onTrackOrder(order.id)}>Track Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
