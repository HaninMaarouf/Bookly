import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Cart from './Cart';
import Favorites from './Favorites';
import AppHeader from '../components/AppHeader';
import AppToast from '../components/AppToast';
import Footer from '../components/Footer';

export default function UserApp() {
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
            <AppHeader
                favoritesCount={favorites.length}
                cartCount={totalCartCount}
                onNavigateDashboard={() => setCurrentPage('dashboard')}
                onNavigateFavorites={() => setCurrentPage('favorites')}
                onNavigateCart={() => setCurrentPage('cart')}
            />
            <AppToast message={toastMessage} />

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
            <Footer />
        </div>
    );
}