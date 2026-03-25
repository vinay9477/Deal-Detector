/**
 * API Client — Axios Instance
 * Centralized HTTP client with interceptors for auth and error handling
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────
// Automatically attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────
// Handle common error responses globally
api.interceptors.response.use(
  (response) => response.data, // Unwrap the data property
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';

    // Auto-logout on 401 (expired or invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem('dd_token');
      localStorage.removeItem('dd_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
