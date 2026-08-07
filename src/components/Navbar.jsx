import React from 'react';
import '../CSS/navbar.css';

export default function Navbar({
    favCount,
    cartCount,
    onNavigate,
    searchQuery,
    setSearchQuery,
    onSearch
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <header className="navbar">
            <h1 className="navbar-logo" onClick={() => onNavigate('dashboard')}>
                Bookly 📚
            </h1>

            {/* Integrated Search Bar inside Navbar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by title, author... (Press Enter)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-btn" onClick={() => onSearch(searchQuery)}>
                    Search
                </button>
            </div>

            {/* Favorites & Cart Action Buttons */}
            <div className="navbar-actions">
                <button className="nav-link-btn" onClick={() => onNavigate('favorites')}>
                    Favorites ♥ ({favCount})
                </button>
                <button className="cart-button" onClick={() => onNavigate('cart')}>
                    Cart 🛒 ({cartCount})
                </button>
            </div>
        </header>
    );
}