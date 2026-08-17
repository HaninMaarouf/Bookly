import React from 'react';
import './SearchPanel.css';

export default function SearchPanel({ searchQuery, loading, onSearchQueryChange, onSearch, onKeyDown }) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={onSearchQueryChange}
                onKeyDown={onKeyDown}
                className="search-input"
            />
            <button onClick={onSearch} disabled={loading} className="search-btn">
                {loading ? 'Searching...' : 'Search'}
            </button>
        </div>
    );
}
