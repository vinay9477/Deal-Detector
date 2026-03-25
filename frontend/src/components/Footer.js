/**
 * Footer Component
 */

import React from 'react';
import { FiGithub, FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Deal Detector</h3>
          <p>Smart price tracking &amp; deal aggregation platform.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="/">Browse Deals</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/alerts">Price Alerts</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="/">API Docs</a>
            <a href="/">Status Page</a>
            <a href="/">Changelog</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FiGithub /> GitHub
            </a>
            <a href="mailto:support@dealdetector.io">
              <FiMail /> Contact
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Made with <FiHeart className="heart-icon" /> by Deal Detector Team &copy;{' '}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
