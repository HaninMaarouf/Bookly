import React, { useState } from 'react';
import './Cart.css';

export default function Cart({ cartItems, setCartItems, onNavigateHome }) {
    const [location, setLocation] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Quantity modifiers
    const handleUpdateQuantity = (id, delta) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    // Item deletion
    const handleRemoveItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Calculations
    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );
    const shippingFee = cartItems.length > 0 ? 5.0 : 0.0;
    const grandTotal = subtotal + shippingFee;

    // Checkout submit
    const handleCheckout = (e) => {
        e.preventDefault();
        if (!location.trim()) {
            alert('Please enter a valid delivery address.');
            return;
        }

        setIsCheckingOut(true);

        // Simulate order API call
        setTimeout(() => {
            setIsCheckingOut(false);
            setOrderSuccess(true);
            setCartItems([]); // Clear local & persisted state
        }, 1500);
    };

    if (orderSuccess) {
        return (
            <div className="cart-page">
                <div className="cart-success-card">
                    <h2>🎉 Order Confirmed!</h2>
                    <p>Thank you for shopping with <strong>Bookly</strong>.</p>
                    <p className="delivery-info">
                        Your books will be shipped to: <br />
                        <span>{location}</span>
                    </p>
                    <button className="btn-primary" onClick={onNavigateHome}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h2>Your Shopping Cart 🛒</h2>
                    <button className="btn-secondary" onClick={onNavigateHome}>
                        ← Back to Search
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <p>Your cart is currently empty.</p>
                        <button className="btn-primary" onClick={onNavigateHome}>
                            Browse Books
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        {/* Cart Item List */}
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <img
                                        src={item.cover_url}
                                        alt={item.title}
                                        className="cart-item-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                'https://via.placeholder.com/128x192?text=No+Cover';
                                        }}
                                    />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-title">{item.title}</h3>
                                        <p className="cart-item-author">By {item.author}</p>
                                        <span className="cart-item-price">${item.price}</span>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Remove Item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary & Delivery Form */}
                        <div className="cart-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span>${shippingFee.toFixed(2)}</span>
                            </div>
                            <hr className="summary-divider" />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>

                            <form onSubmit={handleCheckout} className="checkout-form">
                                <label htmlFor="location">Delivery Address</label>
                                <textarea
                                    id="location"
                                    rows="3"
                                    placeholder="Enter street, city, and postal code..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    className="btn-primary checkout-btn"
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? 'Processing Order...' : 'Complete Checkout'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}