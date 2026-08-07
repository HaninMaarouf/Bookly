import React, { useState } from 'react';

export default function BookCard({ book, favorites = [], onAddToCart, onToggleFav }) {
    const [showModal, setShowModal] = useState(false);

    // Check if current book is favorited
    const isFav = favorites.some((fav) => fav.id === book.id);

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8D8CE',
            borderRadius: '10px',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
            <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                <img
                    src={book.cover_url}
                    alt={book.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover';
                    }}
                    style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        backgroundColor: '#F5F5F5'
                    }}
                />
                <h3 style={{
                    color: '#4A3E3D',
                    fontSize: '16px',
                    margin: '10px 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {book.title}
                </h3>
                <p style={{
                    color: '#8C6D58',
                    fontSize: '14px',
                    margin: '0 0 10px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {book.author}
                </p>
            </div>

            <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid #FAF6F0'
            }}>
                <span style={{ fontWeight: 'bold', color: '#6E5444' }}>${book.price}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onToggleFav && (
                        <button
                            onClick={() => onToggleFav(book)}
                            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                            style={{
                                backgroundColor: isFav ? '#D9534F' : '#FAF6F0',
                                border: isFav ? '1px solid #D9534F' : '1px solid #E8D8CE',
                                color: isFav ? '#FFFFFF' : '#8C6D58',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            ♥
                        </button>
                    )}
                    {onAddToCart && (
                        <button
                            onClick={() => onAddToCart(book)}
                            style={{
                                backgroundColor: '#8C6D58',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500'
                            }}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        zIndex: 1000,
                        padding: '15px'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: '#FAF6F0',
                            padding: '24px',
                            borderRadius: '12px',
                            maxWidth: '450px',
                            width: '100%',
                            border: '1px solid #E8D8CE',
                            maxHeight: '85vh',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <img
                                src={book.cover_url}
                                alt={book.title}
                                style={{ width: '90px', height: '135px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                            <div>
                                <h2 style={{ color: '#4A3E3D', margin: '0 0 6px 0', fontSize: '18px' }}>{book.title}</h2>
                                <p style={{ color: '#8C6D58', margin: '0 0 8px 0', fontWeight: 'bold' }}>By {book.author}</p>
                                <p style={{ color: '#6E5444', margin: '0 0 4px 0', fontSize: '14px' }}>Published: {book.publishedDate}</p>
                                <p style={{ color: '#6E5444', margin: 0, fontWeight: 'bold' }}>Price: ${book.price}</p>
                            </div>
                        </div>

                        <p style={{ color: '#4A3E3D', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>
                            {book.description}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            {book.previewLink && (
                                <a
                                    href={book.previewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        backgroundColor: '#FAF6F0',
                                        border: '1px solid #8C6D58',
                                        color: '#8C6D58',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}
                                >
                                    Google Preview
                                </a>
                            )}
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    backgroundColor: '#8C6D58',
                                    color: '#FFF',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}