/**
 * ProductDetail Page — Full product view with price chart and alert creation
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiBell, FiBookmark } from 'react-icons/fi';
import PriceChart from '../components/PriceChart';
import Loader from '../components/Loader';
import productService from '../services/productService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchPriceHistory();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const response = await productService.getPriceHistory(id);
      setPriceHistory(response.data?.history || []);
    } catch (error) {
      console.error('Failed to fetch price history:', error.message);
    }
  };

  const handleCreateAlert = async () => {
    try {
      await productService.createAlert({
        product: id,
        targetPrice: Number(alertPrice),
        alertType: 'price_below',
      });
      alert('Price alert created successfully!');
      setAlertPrice('');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Loader fullScreen text="Loading product details..." />;
  if (!product) return <div className="error-state">Product not found.</div>;

  const currencySymbol = { USD: '$', INR: '₹', EUR: '€', GBP: '£' }[product.currency] || '$';
  const discount =
    product.originalPrice > 0
      ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="product-detail-page" id="product-detail-page">
      <Link to="/" className="back-link">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="detail-layout">
        {/* Left: Image */}
        <div className="detail-image-section">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            className="detail-image"
          />
          <span className="detail-source">{product.source}</span>
        </div>

        {/* Right: Info */}
        <div className="detail-info-section">
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-price-block">
            <span className="detail-current-price">
              {currencySymbol}{product.currentPrice?.toFixed(2)}
            </span>
            {product.originalPrice > 0 && (
              <>
                <span className="detail-original-price">
                  {currencySymbol}{product.originalPrice?.toFixed(2)}
                </span>
                {discount > 0 && <span className="detail-discount">{discount}% OFF</span>}
              </>
            )}
          </div>

          {/* Price Stats */}
          <div className="price-stats">
            <div className="stat">
              <span className="stat-label">Lowest</span>
              <span className="stat-value low">{currencySymbol}{product.lowestPrice?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Highest</span>
              <span className="stat-value high">{currencySymbol}{product.highestPrice?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{'★'.repeat(Math.floor(product.rating || 0))} ({product.rating || 0})</span>
            </div>
          </div>

          {product.description && (
            <p className="detail-description">{product.description}</p>
          )}

          {/* Actions */}
          <div className="detail-actions">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visit Store <FiExternalLink />
            </a>
            <button className="btn-secondary" onClick={() => productService.trackProduct(id)}>
              <FiBookmark /> Track
            </button>
          </div>

          {/* Create Alert */}
          <div className="alert-create-section">
            <h3><FiBell /> Set Price Alert</h3>
            <div className="alert-form">
              <input
                type="number"
                placeholder="Target price"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="alert-input"
                id="alert-price-input"
              />
              <button className="btn-alert" onClick={handleCreateAlert} id="create-alert-btn">
                Create Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <section className="chart-section">
        <PriceChart priceHistory={priceHistory} productName={product.name} />
      </section>
    </div>
  );
};

export default ProductDetail;
