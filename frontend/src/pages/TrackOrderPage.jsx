import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { OrderContext } from '../context/OrderContext';
import { ReviewContext } from '../context/ReviewContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './TrackOrderPage.css';

const StarInput = ({ rating, onRate }) => (
    <div className="star-input">
        {[1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                className={`star-pick ${star <= rating ? 'filled' : ''}`}
                onClick={() => onRate(star)}
            >★</span>
        ))}
    </div>
);

const TrackOrderPage = ({ orderId, onBack, onNavigate }) => {
    const { orders, ORDER_STATUSES } = useContext(OrderContext);
    const { addReview, getReviews } = useContext(ReviewContext);
    const { user } = useContext(AuthContext);
    const order = orders.find(o => o.id === orderId);

    const [reviewProduct, setReviewProduct] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    const isDelivered = order?.statusIndex === 4;

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewProduct) return;
        addReview(reviewProduct.id, {
            userName: user?.name || 'Anonymous',
            rating: reviewRating,
            comment: reviewComment,
        });
        toast.success('Review submitted! Thank you 🌟');
        setReviewProduct(null);
        setReviewRating(5);
        setReviewComment('');
    };

    const hasReviewed = (productId) => {
        const reviews = getReviews(productId);
        return reviews.some(r => r.userName === (user?.name || 'Anonymous'));
    };

    if (!order) {
        return (
            <div className="track-page">
                <Navbar onNavigate={onNavigate} />
                <div className="track-container">
                    <button className="back-btn" onClick={onBack}>&larr; Back to Orders</button>
                    <div className="track-not-found">
                        <h2>Order not found</h2>
                        <p>The order you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="track-page">
            <Navbar onNavigate={onNavigate} />
            <div className="track-container">
                <button className="back-btn" onClick={onBack}>&larr; Back to Orders</button>
                
                <div className="track-header">
                    <h1>Track Order</h1>
                    <span className="track-order-id">{order.id}</span>
                </div>

                <div className="track-timeline">
                    {ORDER_STATUSES.map((status, i) => (
                        <div key={status} className={`timeline-step ${i <= order.statusIndex ? 'active' : ''} ${i === order.statusIndex ? 'current' : ''}`}>
                            <div className="timeline-dot">
                                {i < order.statusIndex ? '✓' : i === order.statusIndex ? '●' : ''}
                            </div>
                            {i < ORDER_STATUSES.length - 1 && <div className="timeline-line"></div>}
                            <div className="timeline-label">{status}</div>
                        </div>
                    ))}
                </div>

                <div className="track-details-grid">
                    <div className="track-detail-card">
                        <h3>Delivery Address</h3>
                        <p><strong>{order.address?.name}</strong></p>
                        <p>{order.address?.street}</p>
                        <p>{order.address?.city}, {order.address?.zip}</p>
                    </div>
                    <div className="track-detail-card">
                        <h3>Estimated Delivery</h3>
                        <p className="est-date">{order.estimatedDelivery}</p>
                    </div>
                    <div className="track-detail-card">
                        <h3>Payment</h3>
                        <p>{order.paymentMethod === 'credit' ? 'Credit / Debit Card' : order.paymentMethod === 'upi' ? 'UPI / Net Banking' : 'Cash on Delivery'}</p>
                    </div>
                    <div className="track-detail-card">
                        <h3>Order Total</h3>
                        <p className="track-total">${order.total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="track-items-section">
                    <h2>Items in this Order</h2>
                    <div className="track-items-list">
                        {order.items.map(item => (
                            <div key={item.id} className="track-item">
                                <img src={item.image} alt={item.name} />
                                <div className="track-item-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.category} &middot; Qty: {item.quantity}{item.size ? ` · Size: ${item.size}` : ''}</p>
                                </div>
                                <span className="track-item-price">{item.price}</span>
                                {isDelivered && (
                                    hasReviewed(item.id) ? (
                                        <span className="reviewed-badge">✓ Reviewed</span>
                                    ) : (
                                        <button className="write-review-btn" onClick={() => { setReviewProduct(item); setReviewRating(5); setReviewComment(''); }}>
                                            Write Review
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Modal */}
                {reviewProduct && (
                    <div className="review-modal-overlay" onClick={() => setReviewProduct(null)}>
                        <div className="review-modal" onClick={e => e.stopPropagation()}>
                            <button className="review-modal-close" onClick={() => setReviewProduct(null)}>&times;</button>
                            <h2>Review: {reviewProduct.name}</h2>
                            <div className="review-product-preview">
                                <img src={reviewProduct.image} alt={reviewProduct.name} />
                                <div>
                                    <h4>{reviewProduct.name}</h4>
                                    <p>{reviewProduct.category}</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmitReview}>
                                <div className="review-rating-row">
                                    <label>Your Rating</label>
                                    <StarInput rating={reviewRating} onRate={setReviewRating} />
                                </div>
                                <textarea
                                    required
                                    placeholder="Share your experience with this product..."
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    rows={4}
                                />
                                <button type="submit" className="submit-review-btn">Submit Review</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
