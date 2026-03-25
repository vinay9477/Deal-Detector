/**
 * FilterPanel Component
 * Sidebar panel with category, price range, and source filters
 */

import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './FilterPanel.css';

const SOURCES = ['amazon', 'flipkart', 'ebay', 'walmart', 'bestbuy'];

const FilterPanel = ({ categories = [], onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    source: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleReset = () => {
    const defaultFilters = {
      category: '',
      source: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      order: 'desc',
    };
    setFilters(defaultFilters);
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  return (
    <div className="filter-panel" id="filter-panel">
      {/* Header */}
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-title">
          <FiFilter /> Filters
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {isOpen && (
        <div className="filter-body">
          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              id="filter-category"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="filter-group">
            <label className="filter-label">Source</label>
            <select
              className="filter-select"
              value={filters.source}
              onChange={(e) => handleChange('source', e.target.value)}
              id="filter-source"
            >
              <option value="">All Sources</option>
              {SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src.charAt(0).toUpperCase() + src.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="filter-input"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                id="filter-min-price"
              />
              <span className="price-dash">—</span>
              <input
                type="number"
                placeholder="Max"
                className="filter-input"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                id="filter-max-price"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              id="filter-sort"
            >
              <option value="createdAt">Newest First</option>
              <option value="currentPrice">Price: Low to High</option>
              <option value="-currentPrice">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Reset */}
          <button className="filter-reset-btn" onClick={handleReset} id="filter-reset">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
