const { pool } = require('../config/db');
const { syncDeliveredOrderTransactions } = require('../services/transactionsSyncService');

const VALID_TYPES = ['income', 'expense'];

const sanitizeText = (value) => {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value)
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
};

const normalizeDate = (value) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
};

const getTransactionOwnerId = (req) => {
  const requestedUserId = Number(req.query.userId || req.body.userId);
  if (req.user?.isAdmin && requestedUserId > 0) {
    return requestedUserId;
  }

  return Number(req.user?.id);
};

const transactionsController = {
  getTransactions: async (req, res) => {
    try {
      await syncDeliveredOrderTransactions();

      const requestedUserId = Number(req.query.userId);
      const userId = req.user?.isAdmin && !requestedUserId ? null : getTransactionOwnerId(req);
      if (!req.user?.isAdmin && !userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const {
        type,
        category,
        search,
        startDate,
        endDate,
        page = 1,
        limit = 20,
        sortBy = 'transactionDate',
        sortOrder = 'DESC'
      } = req.query;

      if (type && !VALID_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
      }

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (pageNum - 1) * limitNum;
      const validSortColumns = ['id', 'amount', 'type', 'category', 'transactionDate', 'createdAt'];
      const validSortOrders = ['ASC', 'DESC'];
      const sortField = validSortColumns.includes(sortBy) ? sortBy : 'transactionDate';
      const sortDirection = validSortOrders.includes(String(sortOrder).toUpperCase())
        ? String(sortOrder).toUpperCase()
        : 'DESC';

      let query = 'SELECT * FROM transactions WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE 1=1';
      const params = [];

      if (userId) {
        query += ' AND userId = ?';
        countQuery += ' AND userId = ?';
        params.push(userId);
      }

      if (type) {
        query += ' AND type = ?';
        countQuery += ' AND type = ?';
        params.push(type);
      }

      if (category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(sanitizeText(category));
      }

      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
        countQuery += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
        const searchValue = `%${sanitizeText(search)}%`;
        params.push(searchValue, searchValue, searchValue);
      }

      if (startDate) {
        query += ' AND DATE(transactionDate) >= DATE(?)';
        countQuery += ' AND DATE(transactionDate) >= DATE(?)';
        params.push(sanitizeText(startDate));
      }

      if (endDate) {
        query += ' AND DATE(transactionDate) <= DATE(?)';
        countQuery += ' AND DATE(transactionDate) <= DATE(?)';
        params.push(sanitizeText(endDate));
      }

      const connection = await pool.getConnection();

      try {
        const [countResult] = await connection.execute(countQuery, params);
        const total = countResult[0]?.total || 0;

        const listParams = [...params, limitNum, offset];
        const [transactions] = await connection.execute(
          `${query} ORDER BY ${sortField} ${sortDirection}, id DESC LIMIT ? OFFSET ?`,
          listParams
        );

        const [summaryRows] = await connection.execute(
          `SELECT
             COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
             COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
           FROM transactions
           WHERE ${userId ? 'userId = ?' : '1=1'}`,
          userId ? [userId] : []
        );
        const summary = summaryRows[0] || { totalIncome: 0, totalExpense: 0 };

        return res.status(200).json({
          message: 'Transactions retrieved',
          count: transactions.length,
          transactions,
          summary: {
            totalIncome: Number(summary.totalIncome || 0),
            totalExpense: Number(summary.totalExpense || 0),
            balance: Number(summary.totalIncome || 0) - Number(summary.totalExpense || 0)
          },
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get transactions error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || Number.isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [transactions] = await connection.execute(
          'SELECT * FROM transactions WHERE id = ?',
          [id]
        );

        if (transactions.length === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
        }

        const transaction = transactions[0];
        if (!req.user?.isAdmin && Number(transaction.userId) !== Number(req.user?.id)) {
          return res.status(403).json({ message: 'Access denied to this transaction' });
        }

        return res.status(200).json({
          message: 'Transaction details',
          transaction
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get transaction error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  createTransaction: async (req, res) => {
    try {
      const userId = getTransactionOwnerId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const type = sanitizeText(req.body.type);
      const title = sanitizeText(req.body.title);
      const category = sanitizeText(req.body.category);
      const description = sanitizeText(req.body.description);
      const amount = Number(req.body.amount);
      const transactionDate = normalizeDate(req.body.transactionDate);

      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Type must be income or expense' });
      }

      if (!title || !category || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (amount <= 0) {
        return res.status(422).json({ message: 'Amount must be greater than 0' });
      }

      if (!transactionDate) {
        return res.status(422).json({ message: 'Invalid transaction date' });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.execute(
          `INSERT INTO transactions (userId, type, title, amount, category, description, transactionDate)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, type, title, amount, category, description || null, transactionDate]
        );
        const transactionId = result.lastID || result.insertId;

        return res.status(201).json({
          message: 'Transaction created successfully',
          transactionId,
          transaction: {
            id: transactionId,
            userId,
            type,
            title,
            amount,
            category,
            description: description || null,
            transactionDate
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Create transaction error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || Number.isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [transactions] = await connection.execute(
          'SELECT * FROM transactions WHERE id = ?',
          [id]
        );

        if (transactions.length === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
        }

        if (!req.user?.isAdmin && Number(transactions[0].userId) !== Number(req.user?.id)) {
          return res.status(403).json({ message: 'Access denied to this transaction' });
        }

        if (transactions[0].source === 'order') {
          return res.status(403).json({ message: 'Order revenue transactions are updated automatically' });
        }

        const updates = [];
        const values = [];

        if (req.body.type !== undefined) {
          const type = sanitizeText(req.body.type);
          if (!VALID_TYPES.includes(type)) {
            return res.status(400).json({ message: 'Type must be income or expense' });
          }
          updates.push('type = ?');
          values.push(type);
        }

        if (req.body.title !== undefined) {
          const title = sanitizeText(req.body.title);
          if (!title) {
            return res.status(400).json({ message: 'Title cannot be empty' });
          }
          updates.push('title = ?');
          values.push(title);
        }

        if (req.body.amount !== undefined) {
          const amount = Number(req.body.amount);
          if (!amount || amount <= 0) {
            return res.status(422).json({ message: 'Amount must be greater than 0' });
          }
          updates.push('amount = ?');
          values.push(amount);
        }

        if (req.body.category !== undefined) {
          const category = sanitizeText(req.body.category);
          if (!category) {
            return res.status(400).json({ message: 'Category cannot be empty' });
          }
          updates.push('category = ?');
          values.push(category);
        }

        if (req.body.description !== undefined) {
          updates.push('description = ?');
          values.push(sanitizeText(req.body.description) || null);
        }

        if (req.body.transactionDate !== undefined) {
          const transactionDate = normalizeDate(req.body.transactionDate);
          if (!transactionDate) {
            return res.status(422).json({ message: 'Invalid transaction date' });
          }
          updates.push('transactionDate = ?');
          values.push(transactionDate);
        }

        if (updates.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
        }

        updates.push('updatedAt = CURRENT_TIMESTAMP');
        values.push(id);

        await connection.execute(
          `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
          values
        );

        const [updatedTransactions] = await connection.execute(
          'SELECT * FROM transactions WHERE id = ?',
          [id]
        );

        return res.status(200).json({
          message: 'Transaction updated successfully',
          transaction: updatedTransactions[0]
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Update transaction error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || Number.isNaN(Number(id))) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [transactions] = await connection.execute(
          'SELECT * FROM transactions WHERE id = ?',
          [id]
        );

        if (transactions.length === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
        }

        if (!req.user?.isAdmin && Number(transactions[0].userId) !== Number(req.user?.id)) {
          return res.status(403).json({ message: 'Access denied to this transaction' });
        }

        if (transactions[0].source === 'order') {
          return res.status(403).json({ message: 'Order revenue transactions are deleted automatically when the order is no longer delivered' });
        }

        await connection.execute('DELETE FROM transactions WHERE id = ?', [id]);

        return res.status(200).json({
          message: 'Transaction deleted successfully',
          transactionId: Number(id)
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = transactionsController;
