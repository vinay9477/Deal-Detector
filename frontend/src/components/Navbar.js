/**
 * Navbar Component
 * Main navigation bar with auth-aware links
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiBell, FiLogOut, FiTrendingDown } from 'react-icons/fi';
import authService from '../services/authService';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <FiTrendingDown className="brand-icon" />
          <span className="brand-text">Deal Detector</span>
        </Link>

        {/* Search Bar (inline) */}
        <div className="navbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, deals..."
            className="search-input"
            id="navbar-search-input"
          />
        </div>

        {/* Nav Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Deals</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>

          {isLoggedIn ? (
            <>
              <Link to="/alerts" className="nav-link nav-icon" title="Alerts">
                <FiBell />
              </Link>
              <div className="nav-user">
                <FiUser className="user-icon" />
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
              <button className="nav-link nav-icon logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
