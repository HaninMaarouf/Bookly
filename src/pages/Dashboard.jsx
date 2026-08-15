import React, { useState, useEffect, useRef } from 'react';
import BookCard from '../components/BookCard';
import SearchPanel from '../components/SearchPanel';
import SectionCard from '../components/SectionCard';
import BookDetailsModal from '../components/BookDetailsModal';
import './Dashboard.css';

const CATEGORY_OPTIONS = [
    { title: 'History', subtitle: 'Timelines, biographies, and world stories' },
    { title: 'Literature', subtitle: 'Novels, essays, and classic voices' },
    { title: 'Science & Technology', subtitle: 'Curious minds and modern discovery' },
    { title: 'Arts & Culture', subtitle: 'Design, creativity, and inspiration' },
    { title: 'Religion & Philosophy', subtitle: 'Ideas, beliefs, and reflection' },
    { title: 'Lifestyle & Hobbies', subtitle: 'Everyday craft and comfort' },
    { title: 'Health & Medicine', subtitle: 'Wellness and practical guidance' },
    { title: 'Education & References', subtitle: 'Guidebooks and essential knowledge' }
];

const FEATURED_QUERIES = ['classic literature', 'history', 'science'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parsePublicationDate = (value) => {
    if (!value || value === 'Unknown' || value === 'unknown') {
        return null;
    }

    const normalizedValue = value.trim();
    const match = normalizedValue.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);

    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2] || '1');
        const day = Number(match[3] || '1');
        return Date.UTC(year, month - 1, day);
    }

    const parsedDate = Date.parse(normalizedValue);
    return Number.isNaN(parsedDate) ? null : parsedDate;
};

const sortByPublicationDate = (books) => {
    return [...books].sort((leftBook, rightBook) => {
        const leftDate = parsePublicationDate(leftBook.publishedDate);
        const rightDate = parsePublicationDate(rightBook.publishedDate);

        if (leftDate == null && rightDate == null) {
            return 0;
        }
        if (leftDate == null) {
            return 1;
        }
        if (rightDate == null) {
            return -1;
        }

        return rightDate - leftDate;
    });
};

export default function Dashboard({ favorites = [], onAddToCart, onToggleFav }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [featuredBooks, setFeaturedBooks] = useState({ bestSelling: [], mostPopular: [], newestReleases: [] });
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [featuredError, setFeaturedError] = useState('');
    const requestIdRef = useRef(0);

    const fetchBooksFromApi = async (query) => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) {
            return [];
        }

        const res = await fetch(`http://localhost:5000/api/books?q=${encodeURIComponent(normalizedQuery)}`);
        const data = await res.json();

        if (!res.ok || !data.books) {
            throw new Error(data.message || 'Failed to retrieve books.');
        }

        return data.books;
    };

    const fetchBooks = async (query, expectedRequestId = null) => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) {
            setBooks([]);
            setErrorMsg('');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        try {
            const fetchedBooks = await fetchBooksFromApi(normalizedQuery);
            // Only update results if this is still the latest request
            if (expectedRequestId === null || expectedRequestId === requestIdRef.current) {
                setBooks(fetchedBooks);
            }
        } catch (err) {
            console.error('Search failed:', err);
            // Only update error if this is still the latest request
            if (expectedRequestId === null || expectedRequestId === requestIdRef.current) {
               // setErrorMsg('Could not connect to backend server.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isCancelled = false;

        const loadFeaturedBooks = async (attempt = 1) => {
            if (attempt === 1) {
                setFeaturedLoading(true);
                setFeaturedError('');
            }

            try {
                const responses = await Promise.all(FEATURED_QUERIES.map((query) => fetchBooksFromApi(query)));
                if (isCancelled) {
                    return;
                }

                const dedupedBooks = responses
                    .flat()
                    .filter((book, index, allBooks) => index === allBooks.findIndex((candidate) => candidate.id === book.id));

                const newestReleases = sortByPublicationDate(dedupedBooks).slice(0, 4);

                setFeaturedBooks({
                    bestSelling: dedupedBooks.slice(0, 4),
                    mostPopular: dedupedBooks.slice(4, 8),
                    newestReleases
                });
            } catch (err) {
                if (isCancelled) {
                    return;
                }

                if (attempt < 3) {
                    await delay(300 * attempt);
                    return loadFeaturedBooks(attempt + 1);
                }

                console.error('Featured books failed:', err);
                setFeaturedError('We could not load featured books right now.');
            } finally {
                if (!isCancelled) {
                    setFeaturedLoading(false);
                }
            }
        };

        loadFeaturedBooks();

        return () => {
            isCancelled = true;
        };
    }, []);

    // Live search effect: Automatically fetch results as user types
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim()) {
                requestIdRef.current += 1;
                const currentRequestId = requestIdRef.current;
                fetchBooks(searchQuery, currentRequestId);
            } else {
                // If search is empty, clear results
                setBooks([]);
                setErrorMsg('');
                requestIdRef.current += 1;
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchBooks(searchQuery);
        }
    };

    const bestSellingBooks = searchQuery ? books.slice(0, 4) : featuredBooks.bestSelling;
    const popularBooks = searchQuery ? books.slice(4, 8) : featuredBooks.mostPopular;
    const newestReleaseBooks = searchQuery ? books.slice(0, 4) : featuredBooks.newestReleases;

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="hero-panel">
    <h1 className="hero-heading">
        <span className="hero-heading-rotate">
            <span>Discover your next favorite read</span>
            <span>Find stories worth staying up for</span>
            <span>Curated books, chosen with care</span>
        </span>
    </h1>
    <p>Browse thoughtful stories, timeless classics, and practical guides in a calm, curated bookstore setting.</p>
</div>

                <SearchPanel
                    searchQuery={searchQuery}
                    loading={loading}
                    onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={() => fetchBooks(searchQuery)}
                    onKeyDown={handleKeyDown}
                />

                {errorMsg && <p className="dashboard-error">{errorMsg}</p>}

                {!searchQuery && !loading && books.length === 0 && (
                    <>
                        {featuredError && <p className="dashboard-error">{featuredError}</p>}

                        <section className="section-block">
                            <div className="section-header">
                                <h2 className="section-title">Newest Releases</h2>
                               
                            </div>
                            <div className="section-grid">
                                {featuredLoading ? (
                                    <p className="dashboard-loading">Loading fresh releases...</p>
                                ) : newestReleaseBooks.length > 0 ? (
                                    newestReleaseBooks.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            favorites={favorites}
                                            onAddToCart={onAddToCart}
                                            onToggleFav={onToggleFav}
                                            onOpenDetails={() => setSelectedBook(book)}
                                        />
                                    ))
                                ) : (
                                    <p className="dashboard-loading">No release dates available right now.</p>
                                )}
                            </div>
                        </section>

                        <section className="section-block">
                            <div className="section-header">
                                <h2 className="section-title">Best Selling</h2>
                                
                            </div>
                            <div className="section-grid">
                                {bestSellingBooks.length > 0 ? (
                                    bestSellingBooks.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            favorites={favorites}
                                            onAddToCart={onAddToCart}
                                            onToggleFav={onToggleFav}
                                            onOpenDetails={() => setSelectedBook(book)}
                                        />
                                    ))
                                ) : (
                                    <p className="dashboard-loading">Search for a book to see recommendations.</p>
                                )}
                            </div>
                        </section>

                        <section className="section-block">
                            <div className="section-header">
                                <h2 className="section-title">Most Popular</h2>
                               
                            </div>
                            <div className="section-grid">
                                {popularBooks.length > 0 ? (
                                    popularBooks.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            favorites={favorites}
                                            onAddToCart={onAddToCart}
                                            onToggleFav={onToggleFav}
                                            onOpenDetails={() => setSelectedBook(book)}
                                        />
                                    ))
                                ) : (
                                    <p className="dashboard-loading">Popular picks will appear here as you browse.</p>
                                )}
                            </div>
                        </section>

                        <section className="section-block">
                            <div className="section-header">
                                <h2 className="section-title">Browse by Category</h2>
                            </div>
                            <div className="category-grid">
                                {CATEGORY_OPTIONS.map((category) => (
                                    <SectionCard
                                        key={category.title}
                                        title={category.title}
                                        subtitle={category.subtitle}
                                        onClick={() => {
                                            setSearchQuery(category.title);
                                            fetchBooks(category.title);
                                        }}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {loading ? (
                    <p className="dashboard-loading">Searching library...</p>
                ) : (
                    searchQuery && books.length > 0 && (
                        <div className="section-block">
                            <div className="section-header">
                                <h2 className="section-title">Search Results</h2>
                            </div>
                            <div className="section-grid">
                                {books.map((book) => (
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
                        </div>
                    )
                )}
            </div>

            <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        </div>
    );
}