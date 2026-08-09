import React from 'react';
import './AppHeader.css';

export default function AppHeader({ favoritesCount, cartCount, onNavigateDashboard, onNavigateFavorites, onNavigateCart }) {
    return (
        <header className="navbar">
            <h1 className="navbar-logo" onClick={onNavigateDashboard}>
                Bookly 📚
            </h1>
            <div className="navbar-actions">
                <span className="favorites-count" onClick={onNavigateFavorites}>
                    Favorites ♥ ({favoritesCount})
                </span>
                <button className="cart-button" onClick={onNavigateCart}>
                    Cart 🛒 ({cartCount})
                </button>
            </div>
        </header>
    );
}
