const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      return { success: true, message: data.message, token: data.token, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }

      return { success: true, message: data.message, token: data.token, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Token verification failed' };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getAllUsers: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch users' };
      }

      return { success: true, users: data.users || [], count: data.count };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};
