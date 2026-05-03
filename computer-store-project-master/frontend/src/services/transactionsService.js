const API_BASE_URL = 'http://localhost:5000/api';

const buildQuery = (filters = {}) => {
  const query = new URLSearchParams();

  if (filters.type && filters.type !== 'all') query.append('type', filters.type);
  if (filters.category) query.append('category', filters.category);
  if (filters.search) query.append('search', filters.search);
  if (filters.startDate) query.append('startDate', filters.startDate);
  if (filters.endDate) query.append('endDate', filters.endDate);
  if (filters.page) query.append('page', filters.page);
  if (filters.limit) query.append('limit', filters.limit);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);
  if (filters.sortOrder) query.append('sortOrder', filters.sortOrder);

  return query.toString();
};

export const transactionsService = {
  getTransactions: async (token, filters = {}) => {
    try {
      const query = buildQuery(filters);
      const response = await fetch(`${API_BASE_URL}/transactions?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch transactions' };
      }

      return {
        success: true,
        transactions: data.transactions || [],
        summary: data.summary || { totalIncome: 0, totalExpense: 0, balance: 0 },
        pagination: data.pagination || null
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  createTransaction: async (transaction, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to create transaction' };
      }

      return { success: true, transaction: data.transaction, transactionId: data.transactionId };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateTransaction: async (id, updates, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update transaction' };
      }

      return { success: true, transaction: data.transaction };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  deleteTransaction: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to delete transaction' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};
