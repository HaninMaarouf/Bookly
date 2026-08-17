import React from 'react';
import BookCard from '../components/BookCard';
import PageHeader from '../components/PageHeader';
import './favorites.css';

export default function Favorites({ favorites, onAddToCart, onToggleFav, onNavigateHome }) {
    return (
        <div className="favorites-page">
            <div className="favorites-container">
                <PageHeader title="Your Fav Books " actionLabel="← Back " onAction={onNavigateHome} />

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