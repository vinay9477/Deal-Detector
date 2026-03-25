/**
 * ProductCard Component
 * Displays a product with price, discount badge, and action buttons
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiTrendingDown, FiBookmark } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, onTrack }) => {
  const {
    _id,
    name,
    imageUrl,
    currentPrice,
    originalPrice,
    source,
    rating,
    currency = 'USD',
  } = product;

  // Currency symbols
  const currencySymbol = { USD: '$', INR: '₹', EUR: '€', GBP: '£' }[currency] || '$';

  // Calculate discount
  const discount =
    originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="product-card" id={`product-card-${_id}`}>
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="discount-badge">
          <FiTrendingDown /> {discount}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="product-image-wrapper">
        <img
          src={imageUrl || 'https://via.placeholder.com/280x200?text=No+Image'}
          alt={name}
          className="product-image"
          loading="lazy"
        />
        <span className="source-tag">{source}</span>
      </div>

      {/* Product Details */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="price-row">
          <span className="current-price">
            {currencySymbol}{currentPrice?.toFixed(2)}
          </span>
          {originalPrice > 0 && originalPrice !== currentPrice && (
            <span className="original-price">
              {currencySymbol}{originalPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="product-rating">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
            <span className="rating-value">({rating})</span>
          </div>
        )}

        {/* Actions */}
        <div className="product-actions">
          <Link to={`/product/${_id}`} className="btn-view">
            View Details <FiExternalLink />
          </Link>
          <button
            className="btn-track"
            onClick={() => onTrack && onTrack(_id)}
            title="Track this product"
          >
            <FiBookmark />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
