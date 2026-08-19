import React, { useState } from 'react';
import BookCard from '../components/BookCard';
import PageHeader from '../components/PageHeader';
import BookDetailsModal from '../components/BookDetailsModal';
import './favorites.css';

export default function Favorites({ favorites, onAddToCart, onToggleFav, onNavigateHome }) {
    const [selectedBook, setSelectedBook] = useState(null);

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
                                favorites={favorites}
                                onAddToCart={onAddToCart}
                                onToggleFav={onToggleFav}
                                onOpenDetails={() => setSelectedBook(book)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        </div>
    );
}