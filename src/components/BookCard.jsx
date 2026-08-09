import React, { useState } from 'react';
import BookDetailsModal from './BookDetailsModal';
import './BookCard.css';

export default function BookCard({ book, favorites = [], onAddToCart, onToggleFav, onOpenDetails }) {
    const [showModal, setShowModal] = useState(false);
    const isFav = favorites.some((fav) => fav.id === book.id);

    const handleOpenDetails = () => {
        if (onOpenDetails) {
            onOpenDetails(book);
            return;
        }
        setShowModal(true);
    };

    const handleCloseDetails = () => {
        if (onOpenDetails) {
            onOpenDetails(null);
            return;
        }
        setShowModal(false);
    };

    return (
        <div className="book-card">
            <div className="book-card-cover-link" onClick={handleOpenDetails}>
                <img
                    src={book.cover_url}
                    alt={book.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover';
                    }}
                    className="book-card-cover"
                />
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">{book.author}</p>
            </div>

            <div className="book-card-footer">
                <span className="book-card-price">${book.price}</span>
                <div className="book-card-actions">
                    {onToggleFav && (
                        <button
                            onClick={() => onToggleFav(book)}
                            title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                            className={`fav-btn ${isFav ? 'active' : ''}`}
                        >
                            ♥
                        </button>
                    )}
                    {onAddToCart && (
                        <button onClick={() => onAddToCart(book)} className="cart-btn">
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>

            {!onOpenDetails && showModal && <BookDetailsModal book={book} onClose={handleCloseDetails} />}
        </div>
    );
}