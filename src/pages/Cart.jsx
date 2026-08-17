import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onNavigateHome }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );
    const shippingFee = cartItems.length > 0 ? 5.0 : 0.0;
    const grandTotal = subtotal + shippingFee;

    const handleCheckout = async (e) => {
        e.preventDefault();
        setCheckoutError('');

        if (!user) {
            navigate('/login', {
                state: {
                    message: 'Please log in to complete your order.',
                    from: '/dashboard',
                },
            });
            return;
        }

        if (!location.trim()) {
            alert('Please enter a valid delivery address.');
            return;
        }

        setIsCheckingOut(true);

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    location: location.trim(),
                    total: grandTotal,
                    status: 'pending',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const itemsToInsert = cartItems.map((item) => ({
                order_id: order.id,
                title: item.title,
                author: item.author,
                price: item.price,
                quantity: item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            await onClearCart();
            setIsCheckingOut(false);
            setOrderSuccess(true);
        } catch (err) {
            console.error('Checkout failed:', err);
            setIsCheckingOut(false);
            setCheckoutError('Something went wrong placing your order. Please try again.');
        }
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
                    <h2 className="cart-title">
                        Your Shopping Cart
                        <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 6h15l-1.5 9h-12L5 3H2"
                                fill="none"
                                stroke="#4A3E3D"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="9" cy="20" r="1.4" fill="#4A3E3D" />
                            <circle cx="18" cy="20" r="1.4" fill="#4A3E3D" />
                        </svg>
                    </h2>
                    <button className="btn-secondary" onClick={onNavigateHome}>
                        ← Back
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
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="delete-btn"
                                            onClick={() => onRemoveItem(item.id)}
                                            title="Remove Item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

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

                            {!user && (
                                <p style={{ color: '#A9784E', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                                    You'll need to log in to complete checkout.
                                </p>
                            )}

                            <form onSubmit={handleCheckout} className="checkout-form">
                                <label htmlFor="location">Delivery Address</label>
                                <textarea
                                    id="location"
                                    rows="3"
                                    placeholder="Enter street, city, and postal code..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required={!!user}
                                />

                                {checkoutError && (
                                    <p style={{ color: '#B85C5C', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                        {checkoutError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary checkout-btn"
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut
                                        ? 'Processing Order...'
                                        : user
                                        ? 'Complete Checkout'
                                        : 'Log in to Checkout'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}