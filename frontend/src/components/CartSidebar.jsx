import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './CartSidebar.css';

const CartSidebar = ({ onCheckoutClick }) => {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
    const { isLoggedIn, setIsAuthModalOpen } = useContext(AuthContext);

    const handleProceed = () => {
        toggleCart(); // Close sidebar
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        } else {
            onCheckoutClick();
        }
    };

    return (
        <>
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-cart-btn" onClick={toggleCart}>&times;</button>
                </div>
                
                <div className="cart-items-container">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button onClick={toggleCart} className="continue-shopping-btn">Continue Shopping</button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">{item.price}</p>
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Subtotal</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="cart-taxes-note">Taxes and shipping calculated at checkout</p>
                        <button className="checkout-btn" onClick={handleProceed}>Proceed to Checkout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
