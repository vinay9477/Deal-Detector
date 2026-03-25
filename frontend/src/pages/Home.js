/**
 * Home Page — Product listing with search, filters, and top deals
 */

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import productService from '../services/productService';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Fetch products on mount and filter change
  useEffect(() => {
    fetchProducts();
    fetchTopDeals();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        ...filters,
        page: pagination.page,
        limit: 12,
      });
      setProducts(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopDeals = async () => {
    try {
      const response = await productService.getTopDeals(6);
      setTopDeals(response.data || []);
    } catch (error) {
      console.error('Failed to fetch top deals:', error.message);
    }
  };

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleTrack = async (productId) => {
    try {
      await productService.trackProduct(productId);
      alert('Product added to your tracking list!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Find the Best <span className="gradient-text">Deals</span> Online
        </h1>
        <p className="hero-subtitle">
          Track prices across multiple stores. Get notified when prices drop.
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <section className="section">
          <h2 className="section-title">🔥 Top Deals Right Now</h2>
          <div className="products-grid">
            {topDeals.map((product) => (
              <ProductCard key={product._id} product={product} onTrack={handleTrack} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section main-content">
        <div className="content-layout">
          {/* Sidebar Filters */}
          <aside className="sidebar">
            <FilterPanel categories={categories} onFilterChange={handleFilterChange} />
          </aside>

          {/* Product Grid */}
          <div className="products-section">
            <div className="products-header">
              <h2 className="section-title">All Products</h2>
              <span className="results-count">{pagination.total} results</span>
            </div>

            {loading ? (
              <Loader text="Loading products..." />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onTrack={handleTrack} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPagination((p) => ({ ...p, page: i + 1 }))}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
