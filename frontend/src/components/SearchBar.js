/**
 * SearchBar Component
 * Standalone search bar with real-time filtering
 */

import React, { useState, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search for products, brands, categories...' }) => {
  const [query, setQuery] = useState('');

  // Debounced search handler
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      // Trigger search after brief pause
      if (onSearch) {
        clearTimeout(window._searchTimeout);
        window._searchTimeout = setTimeout(() => {
          onSearch(value);
        }, 400);
      }
    },
    [onSearch]
  );

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="search-bar" id="search-bar">
      <FiSearch className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        id="search-bar-input"
      />
      {query && (
        <button className="search-bar-clear" onClick={handleClear}>
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
