/**
 * Dashboard Page — User's tracked products, alerts summary, and statistics
 */

import React, { useState, useEffect } from 'react';
import { FiPackage, FiBell, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import authService from '../services/authService';
import productService from '../services/productService';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await authService.getProfile();
      setUser(profileRes.data);
      setTrackedProducts(profileRes.data?.trackedProducts || []);

      const alertsRes = await productService.getAlerts();
      setAlerts(alertsRes.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Loading dashboard..." />;

  const activeAlerts = alerts.filter((a) => a.isActive && !a.isTriggered).length;
  const triggeredAlerts = alerts.filter((a) => a.isTriggered).length;

  return (
    <div className="dashboard-page" id="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-greeting">
        Welcome back, <strong>{user?.name || 'User'}</strong>!
      </p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiPackage className="stat-icon" />
          <div>
            <span className="stat-number">{trackedProducts.length}</span>
            <span className="stat-desc">Tracked Products</span>
          </div>
        </div>
        <div className="stat-card">
          <FiBell className="stat-icon alert-icon" />
          <div>
            <span className="stat-number">{activeAlerts}</span>
            <span className="stat-desc">Active Alerts</span>
          </div>
        </div>
        <div className="stat-card">
          <FiTrendingDown className="stat-icon triggered-icon" />
          <div>
            <span className="stat-number">{triggeredAlerts}</span>
            <span className="stat-desc">Triggered Alerts</span>
          </div>
        </div>
        <div className="stat-card">
          <FiDollarSign className="stat-icon savings-icon" />
          <div>
            <span className="stat-number">$0.00</span>
            <span className="stat-desc">Estimated Savings</span>
          </div>
        </div>
      </div>

      {/* Tracked Products */}
      <section className="dashboard-section">
        <h2>Your Tracked Products</h2>
        {trackedProducts.length === 0 ? (
          <div className="empty-state">
            <p>You're not tracking any products yet. Start browsing deals!</p>
          </div>
        ) : (
          <div className="products-grid">
            {trackedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Alerts */}
      <section className="dashboard-section">
        <h2>Recent Alerts</h2>
        {alerts.length === 0 ? (
          <div className="empty-state">
            <p>No price alerts set. Visit a product to create one.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert._id} className={`alert-item ${alert.isTriggered ? 'triggered' : ''}`}>
                <div className="alert-product-name">{alert.product?.name || 'Unknown Product'}</div>
                <div className="alert-target">Target: ${alert.targetPrice?.toFixed(2)}</div>
                <div className={`alert-status ${alert.isTriggered ? 'triggered' : 'active'}`}>
                  {alert.isTriggered ? '✅ Triggered' : '🔔 Active'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
