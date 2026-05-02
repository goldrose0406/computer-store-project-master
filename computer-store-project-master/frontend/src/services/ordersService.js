const API_BASE_URL = 'http://localhost:5000/api';

export const ordersService = {
  createOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to create order' };
      }

      return { success: true, message: data.message, orderId: data.orderId, order: data.order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getMyOrders: async (token, filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append('search', filters.search);
      if (filters.startDate) query.append('startDate', filters.startDate);
      if (filters.endDate) query.append('endDate', filters.endDate);
      if (filters.status) query.append('status', filters.status);
      if (filters.sortBy) query.append('sortBy', filters.sortBy);
      if (filters.sortOrder) query.append('sortOrder', filters.sortOrder);
      if (filters.page) query.append('page', filters.page);
      if (filters.limit) query.append('limit', filters.limit);

      const response = await fetch(`${API_BASE_URL}/orders/my-orders?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch orders' };
      }

      return {
        success: true,
        orders: data.orders || [],
        pagination: data.pagination || null
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getOrderDetails: async (orderId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Order not found' };
      }

      return { success: true, order: data.order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getAllOrders: async (token, filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append('search', filters.search);
      if (filters.startDate) query.append('startDate', filters.startDate);
      if (filters.endDate) query.append('endDate', filters.endDate);
      if (filters.status) query.append('status', filters.status);
      if (filters.sortBy) query.append('sortBy', filters.sortBy);
      if (filters.sortOrder) query.append('sortOrder', filters.sortOrder);
      if (filters.page) query.append('page', filters.page);
      if (filters.limit) query.append('limit', filters.limit);

      const response = await fetch(`${API_BASE_URL}/orders?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch orders' };
      }

      return {
        success: true,
        orders: data.orders || [],
        pagination: data.pagination || null
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateOrderStatus: async (orderId, status, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update order status' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getOrderStatusHistory: async (orderId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch order status history' };
      }

      return { success: true, history: data.history || [] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};
