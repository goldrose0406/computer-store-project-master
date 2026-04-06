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

  getMyOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
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

      return { success: true, orders: data.orders || [] };
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

  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
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

      return { success: true, orders: data.orders || [] };
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
  }
};
