import React from 'react';
import BookCard from '../components/BookCard';
import '../CSS/favorites.css'; // Adjust path based on your folder layout

export default function Favorites({ favorites, onAddToCart, onToggleFav, onNavigateHome }) {
    return (
        <div className="favorites-page">
            <div className="favorites-container">
                <div className="favorites-header">
                    <h2>Your Saved Books ♥</h2>
                    <button className="btn-secondary" onClick={onNavigateHome}>
                        ← Back to Search
                    </button>
                </div>

                {favorites.length === 0 ? (
                    <div className="favorites-empty">
                        <p>You haven't added any books to your favorites yet.</p>
                        <button className="btn-primary" onClick={onNavigateHome}>
                            Explore Library
                        </button>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onAddToCart={onAddToCart}
                                onToggleFav={onToggleFav}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}