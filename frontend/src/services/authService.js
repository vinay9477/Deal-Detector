/**
 * Auth Service — handles login, registration, and token management
 */

import api from './api';

const AUTH_TOKEN_KEY = 'dd_token';
const AUTH_USER_KEY = 'dd_user';

const authService = {
  /**
   * Register a new user
   * @param {object} userData - { name, email, password }
   */
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Login with email and password
   * @param {object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Get the currently stored user
   */
  getCurrentUser: () => {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Get current user profile from API
   */
  getProfile: () => api.get('/users/me'),

  /**
   * Update user profile
   */
  updateProfile: (data) => api.put('/users/me', data),
};

export default authService;
