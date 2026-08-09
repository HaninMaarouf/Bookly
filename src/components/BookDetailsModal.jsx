import React, { useEffect } from 'react';
import './BookDetailsModal.css';

export default function BookDetailsModal({ book, onClose }) {
    useEffect(() => {
        if (!book) {
            return undefined;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [book, onClose]);

    if (!book) return null;

    return (
        <div className="book-details-overlay" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="book-details-modal" onClick={(event) => event.stopPropagation()}>
                <button className="book-details-close" onClick={onClose} aria-label="Close details">
                    ×
                </button>

                <div className="book-details-header">
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="book-details-image"
                        onError={(event) => {
                            event.target.onerror = null;
                            event.target.src = 'https://via.placeholder.com/128x192?text=No+Cover';
                        }}
                    />
                    <div className="book-details-meta">
                        <p className="book-details-eyebrow">Book details</p>
                        <h2>{book.title}</h2>
                        <p className="book-details-author">By {book.author}</p>
                        <p className="book-details-info">Published: {book.publishedDate}</p>
                        <p className="book-details-price">Price: ${book.price}</p>
                    </div>
                </div>

                <p className="book-details-description">{book.description}</p>

                <div className="book-details-actions">
                    {book.previewLink && (
                        <a href={book.previewLink} target="_blank" rel="noreferrer" className="book-details-link">
                            Google Preview
                        </a>
                    )}
                    <button className="book-details-close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
