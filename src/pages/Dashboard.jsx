import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

export default function Dashboard({ onAddToCart, onToggleFav }) {
    const [searchQuery, setSearchQuery] = useState('fiction');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchBooks = async (query) => {
        if (!query.trim()) return;
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`http://localhost:5000/api/books?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (res.ok && data.books) {
                setBooks(data.books);
            } else {
                setErrorMsg(data.message || 'Failed to retrieve books.');
            }
        } catch (err) {
            console.error('Search failed:', err);
            setErrorMsg('Could not connect to backend server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks('fiction');
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchBooks(searchQuery);
        }
    };

    return (
        <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Search Input Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <input
                        type="text"
                        placeholder="Search by title, author, or category (Press Enter)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E8D8CE',
                            backgroundColor: '#FFFFFF',
                            fontSize: '15px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={() => fetchBooks(searchQuery)}
                        disabled={loading}
                        style={{
                            backgroundColor: '#8C6D58',
                            color: '#FFF',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <p style={{ color: '#D9534F', textAlign: 'center', marginBottom: '20px', fontWeight: '500' }}>
                        {errorMsg}
                    </p>
                )}

                {/* Book Grid */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#8C6D58', marginTop: '40px', fontSize: '16px' }}>
                        Searching library...
                    </p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {books.map((book) => (
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