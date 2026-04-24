import React, { useState, useRef, useContext, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ReviewContext } from '../context/ReviewContext';
import { products } from '../data/products';
import Navbar from '../components/Navbar';
import './ProductsPage.css';

gsap.registerPlugin(ScrollTrigger);

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
                    onClick={() => interactive && onRate(star)}
                >★</span>
            ))}
        </div>
    );
};

const ProductsPage = ({ onBack, onBuyNow, onNavigate, initialSearch = '' }) => {
    const containerRef = useRef(null);
    const { addToCart } = useContext(CartContext);
    const { isLoggedIn, setIsAuthModalOpen } = useContext(AuthContext);
    const { getReviews, getAverageRating } = useContext(ReviewContext);
    
    const [searchText, setSearchText] = useState(initialSearch);
    const [filterGender, setFilterGender] = useState('All');
    const [filterColor, setFilterColor] = useState('All');
    const [filterFabric, setFilterFabric] = useState('All');
    const [filterOccasion, setFilterOccasion] = useState('All');
    const [sortPrice, setSortPrice] = useState('default');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [showCartAlert, setShowCartAlert] = useState(false);
    const [cartAlertProduct, setCartAlertProduct] = useState(null);

    useEffect(() => {
        setSearchText(initialSearch);
    }, [initialSearch]);

    const getPriceValue = (priceStr) => parseInt(priceStr.replace(/[^0-9]/g, ''), 10);

    const handleAddToCart = (product) => {
        addToCart({ ...product, size: selectedSize });
        setCartAlertProduct(product);
        setShowCartAlert(true);
        setTimeout(() => setShowCartAlert(false), 3000);
    };

    const handleBuyNow = (product) => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
            toast.info('Please login first to proceed.');
            return;
        }
        addToCart({ ...product, size: selectedSize });
        setQuickViewProduct(null);
        onBuyNow();
    };

    const colors = ['All', ...new Set(products.map(p => p.color))];
    const fabrics = ['All', ...new Set(products.map(p => p.fabric))];
    const occasions = ['All', ...new Set(products.map(p => p.occasion))];

    const searchLower = searchText.toLowerCase();

    let filteredProducts = products.filter(p => {
        // Search filter
        if (searchText) {
            const match = p.name.toLowerCase().includes(searchLower) ||
                p.category.toLowerCase().includes(searchLower) ||
                p.color.toLowerCase().includes(searchLower) ||
                p.fabric.toLowerCase().includes(searchLower) ||
                p.occasion.toLowerCase().includes(searchLower) ||
                p.gender.toLowerCase().includes(searchLower) ||
                p.desc.toLowerCase().includes(searchLower);
            if (!match) return false;
        }
        if (filterGender !== 'All' && p.gender !== filterGender) return false;
        if (filterColor !== 'All' && p.color !== filterColor) return false;
        if (filterFabric !== 'All' && p.fabric !== filterFabric) return false;
        if (filterOccasion !== 'All' && p.occasion !== filterOccasion) return false;
        return true;
    });

    if (sortPrice === 'lowToHigh') {
        filteredProducts.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
    } else if (sortPrice === 'highToLow') {
        filteredProducts.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
    }

    const hasActiveFilters = filterGender !== 'All' || filterColor !== 'All' || filterFabric !== 'All' || filterOccasion !== 'All' || searchText;

    const clearAll = () => {
        setFilterGender('All'); setFilterColor('All'); setFilterFabric('All'); setFilterOccasion('All'); setSearchText('');
    };

    useGSAP(() => {
        gsap.from(".products-header h1, .products-header p", {
            y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
        });
        gsap.from(".filter-bar", {
            y: -30, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out"
        });
        gsap.fromTo(".product-card", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5 }
        );
    }, { scope: containerRef });

    const productReviews = quickViewProduct ? getReviews(quickViewProduct.id) : [];
    const avgRating = quickViewProduct ? getAverageRating(quickViewProduct.id) : 0;

    return (
        <div className="products-page" ref={containerRef}>
            <Navbar onNavigate={onNavigate} />

            {/* Custom Add to Cart Alert */}
            <div className={`cart-added-alert ${showCartAlert ? 'show' : ''}`}>
                <div className="cart-alert-inner">
                    <div className="cart-alert-check">✓</div>
                    <div className="cart-alert-text">
                        <strong>{cartAlertProduct?.name}</strong>
                        <span>Size {selectedSize} · Added to Cart</span>
                    </div>
                </div>
            </div>

            <header className="products-header">
                <button className="products-back-btn" onClick={onBack}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back to Home
                </button>
                <h1>Daenerys Boutique</h1>
                <p>Curated luxury. Filter your desires.</p>
            </header>

            {/* Horizontal Filter Bar */}
            <div className="filter-bar">
                <div className="filter-bar-inner">
                    <div className="filter-search-inline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input 
                            type="text" 
                            placeholder="Search in products..." 
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                        <option value="All">All Collections</option>
                        <option value="Bride">Bridal Wear</option>
                        <option value="Groom">Groom Attire</option>
                    </select>
                    <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
                        {colors.map(c => <option key={c} value={c}>{c === 'All' ? 'All Colors' : c}</option>)}
                    </select>
                    <select value={filterFabric} onChange={(e) => setFilterFabric(e.target.value)}>
                        {fabrics.map(f => <option key={f} value={f}>{f === 'All' ? 'All Fabrics' : f}</option>)}
                    </select>
                    <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)}>
                        {occasions.map(o => <option key={o} value={o}>{o === 'All' ? 'All Occasions' : o}</option>)}
                    </select>
                    <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
                        <option value="default">Featured</option>
                        <option value="lowToHigh">Price: Low → High</option>
                        <option value="highToLow">Price: High → Low</option>
                    </select>
                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearAll}>Clear All</button>
                    )}
                </div>
                <div className="filter-results-count">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    {searchText && <span> for "<strong>{searchText}</strong>"</span>}
                </div>
            </div>

            <div className="products-main-area">
                <div className="products-grid">
                    {filteredProducts.map(p => {
                        const pAvg = getAverageRating(p.id);
                        const pCount = getReviews(p.id).length;
                        return (
                            <div key={p.id} className="product-card">
                                <div className="product-image-wrapper">
                                    <img src={p.image} alt={p.name} />
                                    <div className="product-card-overlay">
                                        <button className="card-add-btn" onClick={() => { setQuickViewProduct(p); setSelectedSize('M'); }}>Quick View</button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{p.category}</span>
                                    <h3>{p.name}</h3>
                                    <p className="product-price">{p.price}</p>
                                    {pCount > 0 && (
                                        <div className="product-rating-mini">
                                            <span className="mini-stars">{'★'.repeat(Math.round(pAvg))}{'☆'.repeat(5 - Math.round(pAvg))}</span>
                                            <span className="mini-count">({pCount})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <h3>No pieces found matching your criteria.</h3>
                            <button onClick={clearAll}>Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div className="quick-view-modal">
                    <div className="qv-overlay" onClick={() => setQuickViewProduct(null)}></div>
                    <div className="qv-content">
                        <button className="qv-close" onClick={() => setQuickViewProduct(null)}>&times;</button>
                        <div className="qv-left">
                            <img src={quickViewProduct.image} alt={quickViewProduct.name} />
                        </div>
                        <div className="qv-right">
                            <span className="qv-category">{quickViewProduct.category}</span>
                            <h2>{quickViewProduct.name}</h2>
                            
                            {productReviews.length > 0 && (
                                <div className="qv-rating-summary">
                                    <StarRating rating={Math.round(avgRating)} />
                                    <span className="qv-rating-text">{avgRating} · {productReviews.length} review{productReviews.length > 1 ? 's' : ''}</span>
                                </div>
                            )}

                            <div className="qv-meta">
                                <span><strong>Color:</strong> {quickViewProduct.color}</span>
                                <span><strong>Fabric:</strong> {quickViewProduct.fabric}</span>
                                <span><strong>Occasion:</strong> {quickViewProduct.occasion}</span>
                            </div>

                            <p className="qv-desc">{quickViewProduct.desc}</p>

                            {productReviews.length > 0 && (
                                <div className="qv-reviews-inline">
                                    <h4>Customer Reviews</h4>
                                    {productReviews.slice(0, 3).map(rv => (
                                        <div key={rv.id} className="qv-review-item">
                                            <div className="qv-review-header">
                                                <strong>{rv.userName}</strong>
                                                <StarRating rating={rv.rating} />
                                            </div>
                                            <p>{rv.comment}</p>
                                        </div>
                                    ))}
                                    {productReviews.length > 3 && <span className="qv-more-reviews">+{productReviews.length - 3} more reviews</span>}
                                </div>
                            )}

                            <div className="qv-size-section">
                                <h4>Select Size</h4>
                                <div className="qv-sizes">
                                    {SIZES.map(s => (
                                        <button 
                                            key={s} 
                                            className={`qv-size-btn ${selectedSize === s ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(s)}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="qv-price">{quickViewProduct.price}</div>
                            
                            <div className="qv-actions">
                                <button className="qv-buy" onClick={() => handleBuyNow(quickViewProduct)}>Buy Now</button>
                                <button className="qv-cart" onClick={() => handleAddToCart(quickViewProduct)}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
