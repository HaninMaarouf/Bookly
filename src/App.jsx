import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import './CSS/navbar.css';

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [toastMessage, setToastMessage] = useState('');

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('bookly_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const savedFavs = localStorage.getItem('bookly_favorites');
        return savedFavs ? JSON.parse(savedFavs) : [];
    });

    useEffect(() => {
        localStorage.setItem('bookly_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('bookly_favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Toast trigger helper
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    const handleAddToCart = (book) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((item) => item.id === book.id);
            if (existing) {
                return prevItems.map((item) =>
                    item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...book, quantity: 1 }];
        });
        showToast(`🛒 "${book.title}" added to cart!`);
    };

    const handleToggleFav = (book) => {
        setFavorites((prevFavs) => {
            const exists = prevFavs.some((item) => item.id === book.id);
            if (exists) {
                showToast(` Removed "${book.title}" from favorites.`);
                return prevFavs.filter((item) => item.id !== book.id);
            }
            showToast(` Added "${book.title}" to favorites!`);
            return [...prevFavs, book];
        });
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="app-container">
            {/* Navigation Header */}
            <header className="navbar">
                <h1 className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>
                    Bookly 📚
                </h1>
                <div className="navbar-actions">
                    <span
                        className="favorites-count"
                        onClick={() => setCurrentPage('favorites')}
                    >
                        Favorites ♥ ({favorites.length})
                    </span>
                    <button
                        className="cart-button"
                        onClick={() => setCurrentPage('cart')}
                    >
                        Cart 🛒 ({totalCartCount})
                    </button>
                </div>
            </header>

            {/* Toast Notification Container */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#4A3E3D',
                    color: '#FFF',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                }}>
                    {toastMessage}
                </div>
            )}

            {/* Main Views */}
            <main className="main-content">
                {currentPage === 'dashboard' && (
                    <Dashboard
                        favorites={favorites}
                        onAddToCart={handleAddToCart}
                        onToggleFav={handleToggleFav}
                    />
                )}
                {currentPage === 'cart' && (
                    <Cart
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        onNavigateHome={() => setCurrentPage('dashboard')}
                    />
                )}
                {currentPage === 'favorites' && (
                    <Favorites
                        favorites={favorites}
                        onAddToCart={handleAddToCart}
                        onToggleFav={handleToggleFav}
                        onNavigateHome={() => setCurrentPage('dashboard')}
                    />
                )}
            </main>
        </div>
    );
}