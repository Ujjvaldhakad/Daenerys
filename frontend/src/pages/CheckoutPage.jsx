import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import './CheckoutPage.css';

const CheckoutPage = ({ onBack, onComplete, onNavigate }) => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { placeOrder } = useContext(OrderContext);
    
    // Address State
    const [savedAddress, setSavedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({ name: '', street: '', city: '', zip: '' });
    
    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('credit');

    const handleSaveAddress = (e) => {
        e.preventDefault();
        setSavedAddress(addressForm);
        setShowAddressModal(false);
        toast.success("Address saved successfully!");
    };

    const handlePlaceOrder = () => {
        if (!savedAddress) {
            setShowAddressModal(true);
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }
        const order = placeOrder(cartItems, cartTotal, savedAddress, paymentMethod);
        toast.success(`Order ${order.id} placed successfully! 🎉`);
        clearCart();
        onComplete(order.id);
    };

    return (
        <div className="checkout-page">
            <Navbar onNavigate={onNavigate} />
            <header className="checkout-header">
                <button className="back-btn" onClick={onBack}>&larr; Back to Shop</button>
                <h1>Secure Checkout</h1>
            </header>

            <div className="checkout-container">
                <div className="checkout-left">
                    <section className="checkout-section">
                        <h2>1. Delivery Address</h2>
                        {savedAddress ? (
                            <div className="saved-address-card">
                                <p><strong>{savedAddress.name}</strong></p>
                                <p>{savedAddress.street}</p>
                                <p>{savedAddress.city}, {savedAddress.zip}</p>
                                <button onClick={() => setShowAddressModal(true)}>Edit Address</button>
                            </div>
                        ) : (
                            <div className="no-address">
                                <p>No address saved.</p>
                                <button className="add-address-btn" onClick={() => setShowAddressModal(true)}>Add Delivery Address</button>
                            </div>
                        )}
                    </section>

                    <section className="checkout-section">
                        <h2>2. Payment Method</h2>
                        <div className="payment-options">
                            <label className={`payment-option ${paymentMethod === 'credit' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} />
                                <span>Credit / Debit Card</span>
                            </label>
                            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                                <span>UPI / Net Banking</span>
                            </label>
                            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </section>
                </div>

                <div className="checkout-right">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="summary-details">
                                        <h4>{item.name}</h4>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <div className="summary-price">{item.price}</div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-totals">
                            <div className="tot-row"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
                            <div className="tot-row"><span>Shipping</span><span>Free</span></div>
                            <div className="tot-row grand-total"><span>Total</span><span>${cartTotal.toLocaleString()}</span></div>
                        </div>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="address-modal-overlay">
                    <div className="address-modal">
                        <h2>Enter Delivery Address</h2>
                        <form onSubmit={handleSaveAddress}>
                            <input required type="text" placeholder="Full Name" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
                            <input required type="text" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
                            <div className="form-row">
                                <input required type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                                <input required type="text" placeholder="Zip / Postal Code" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddressModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
