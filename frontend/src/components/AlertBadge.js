/**
 * AlertBadge Component
 * Small badge to show alert status on product cards or lists
 */

import React from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import './AlertBadge.css';

const AlertBadge = ({ isActive = true, isTriggered = false, targetPrice, onClick }) => {
  const getStatus = () => {
    if (isTriggered) return { label: 'Triggered!', className: 'alert-triggered', icon: <FiBell /> };
    if (isActive) return { label: `Alert: $${targetPrice}`, className: 'alert-active', icon: <FiBell /> };
    return { label: 'Inactive', className: 'alert-inactive', icon: <FiBellOff /> };
  };

  const status = getStatus();

  return (
    <button
      className={`alert-badge ${status.className}`}
      onClick={onClick}
      title={status.label}
      id="alert-badge"
    >
      {status.icon}
      <span className="alert-badge-label">{status.label}</span>
    </button>
  );
};

export default AlertBadge;
