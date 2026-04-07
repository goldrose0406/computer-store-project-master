const API_BASE_URL = 'http://localhost:5000/api';

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
      const url = `${API_BASE_URL}/auth/users`;
      console.log('📡 Fetching users from:', url);
      console.log('Token prefix:', token?.substring(0, 20) + '...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data:', data);

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data.message);
        return { success: false, message: data.message || 'Failed to fetch users' };
      }

      console.log('✅ Users fetched successfully. Count:', data.count);
      return { success: true, users: data.users || [], count: data.count };
    } catch (error) {
      console.error('❌ Network/Parse error in getAllUsers:', error);
      return { success: false, message: error.message };
    }
  }
};
