/**
 * Loader Component
 * Full-screen or inline loading spinner
 */

import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  return (
    <div className={`loader-wrapper ${fullScreen ? 'loader-fullscreen' : ''}`} id="loader">
      <div className="loader-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
