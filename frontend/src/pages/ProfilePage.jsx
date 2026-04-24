import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

const ProfilePage = ({ onBack, onViewOrders, onNavigate }) => {
    const { user, login, logout } = useContext(AuthContext);
    const { orders } = useContext(OrderContext);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

    const handleSave = (e) => {
        e.preventDefault();
        login({ ...user, ...form });
        setEditing(false);
        toast.success('Profile updated!');
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        onBack();
    };

    return (
        <div className="profile-page">
            <Navbar onNavigate={onNavigate} />
            <div className="profile-container">
                <button className="back-btn" onClick={onBack}>&larr; Back to Home</button>
                <div className="profile-card">
                    <div className="profile-avatar">
                        <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <h1>{user?.name || 'User'}</h1>
                    <p className="profile-email">{user?.email}</p>

                    {!editing ? (
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Name</span>
                                <span className="detail-value">{user?.name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{user?.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Phone</span>
                                <span className="detail-value">{user?.phone || 'Not set'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Total Orders</span>
                                <span className="detail-value">{orders.length}</span>
                            </div>
                            <div className="profile-actions">
                                <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
                                <button className="orders-btn" onClick={onViewOrders}>View Orders</button>
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <form className="profile-form" onSubmit={handleSave}>
                            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" required />
                            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" required />
                            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone Number" />
                            <div className="profile-actions">
                                <button type="submit" className="edit-btn">Save Changes</button>
                                <button type="button" className="logout-btn" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
