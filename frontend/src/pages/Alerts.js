/**
 * Alerts Page — Manage all price alerts
 */

import React, { useState, useEffect } from 'react';
import { FiBell, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import AlertBadge from '../components/AlertBadge';
import Loader from '../components/Loader';
import productService from '../services/productService';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | active | triggered

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alertId) => {
    if (!window.confirm('Delete this alert?')) return;
    try {
      await productService.deleteAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active') return a.isActive && !a.isTriggered;
    if (filter === 'triggered') return a.isTriggered;
    return true;
  });

  if (loading) return <Loader text="Loading alerts..." />;

  return (
    <div className="alerts-page" id="alerts-page">
      <div className="alerts-header">
        <h1><FiBell /> Price Alerts</h1>
        <div className="alerts-tabs">
          {['all', 'active', 'triggered'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="empty-state">
          <FiBell className="empty-icon" />
          <p>No {filter !== 'all' ? filter : ''} alerts found.</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {filteredAlerts.map((alert) => (
            <div key={alert._id} className="alert-card">
              <div className="alert-card-header">
                <h3>{alert.product?.name || 'Unknown Product'}</h3>
                <AlertBadge
                  isActive={alert.isActive}
                  isTriggered={alert.isTriggered}
                  targetPrice={alert.targetPrice}
                />
              </div>

              <div className="alert-card-body">
                <div className="alert-detail">
                  <span className="label">Current Price:</span>
                  <span className="value">${alert.product?.currentPrice?.toFixed(2) || '—'}</span>
                </div>
                <div className="alert-detail">
                  <span className="label">Target Price:</span>
                  <span className="value target">${alert.targetPrice?.toFixed(2)}</span>
                </div>
                <div className="alert-detail">
                  <span className="label">Type:</span>
                  <span className="value">{alert.alertType?.replace('_', ' ')}</span>
                </div>
                <div className="alert-detail">
                  <span className="label">Method:</span>
                  <span className="value">{alert.notificationMethod}</span>
                </div>
              </div>

              <div className="alert-card-footer">
                <button className="delete-btn" onClick={() => handleDelete(alert._id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
