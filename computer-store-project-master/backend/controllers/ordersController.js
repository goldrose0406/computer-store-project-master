const { pool } = require('../config/db');
const { sendOrderConfirmation } = require('../services/emailService');
const { syncDeliveredOrderTransactions } = require('../services/transactionsSyncService');

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

const isValidVNPhone = (phone) => /^[0-9]{10}$/.test(phone);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ordersController = {
  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const rawBody = req.body || {};
      const customerName = sanitizeText(rawBody.customerName);
      const customerEmail = sanitizeText(rawBody.customerEmail).toLowerCase();
      const customerPhone = sanitizeText(rawBody.customerPhone);
      const customerAddress = sanitizeText(rawBody.customerAddress);
      const notes = sanitizeText(rawBody.notes);
      const products = rawBody.products;
      const totalPrice = Number(rawBody.totalPrice);
      let userId = req.user?.id;

      // Validate - phải có user (token bắt buộc)
      if (!userId && !req.user?.email) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Validate input
      if (!customerName || !customerEmail || !customerPhone || !customerAddress || !products || !totalPrice) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!isValidEmail(customerEmail)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      if (!isValidVNPhone(customerPhone)) {
        return res.status(400).json({ message: 'Số điện thoại phải đúng định dạng 10 chữ số VN' });
      }

      if (totalPrice <= 0) {
        return res.status(400).json({ message: 'Tổng tiền phải lớn hơn 0' });
      }

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products array cannot be empty' });
      }

      const validProducts = products.every((item) => {
        return item && Number(item.id) > 0 && Number(item.quantity) > 0 && Number(item.price) >= 0;
      });

      if (!validProducts) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const connection = await pool.getConnection();

      try {
        // ✅ CHECK STOCK FOR EACH PRODUCT
        if (!userId && req.user?.email) {
          const [users] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [req.user.email]
          );
          userId = users[0]?.id;
        }

        if (!userId) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        const outOfStockProducts = [];
        
        for (const item of products) {
          const [productData] = await connection.execute(
            'SELECT id, name, stock FROM products WHERE id = ?',
            [item.id]
          );

          if (productData.length === 0) {
            return res.status(404).json({ message: `Product ${item.id} not found` });
          }

          const product = productData[0];
          if (product.stock === undefined || product.stock === null) {
            // If stock field doesn't exist, assume unlimited
            continue;
          }

          if (product.stock < item.quantity) {
            outOfStockProducts.push({
              id: product.id,
              name: product.name,
              requested: item.quantity,
              available: product.stock
            });
          }
        }

        // If any product is out of stock, reject the order
        if (outOfStockProducts.length > 0) {
          return res.status(422).json({
            message: 'Some products are out of stock',
            outOfStockProducts
          });
        }

        const totalItems = products.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Chèn order vào database
        const [result] = await connection.execute(
          `INSERT INTO orders (userId, customerName, customerEmail, customerPhone, customerAddress, products, totalPrice, totalItems, status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
          [userId, customerName, customerEmail, customerPhone, customerAddress, JSON.stringify(products), totalPrice, totalItems, notes || null]
        );
        const orderId = result.lastID || result.insertId;

        // ✅ DEDUCT STOCK FROM PRODUCTS
        for (const item of products) {
          await connection.execute(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.id]
          );
        }

        // ✅ SEND ORDER CONFIRMATION EMAIL
        await sendOrderConfirmation(customerEmail, {
          orderId,
          customerName,
          products,
          totalPrice,
          totalItems
        });

        return res.status(201).json({
          message: 'Order created successfully',
          orderId,
          order: {
            id: orderId,
            customerName,
            customerEmail,
            totalPrice,
            totalItems,
            status: 'pending'
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy tất cả đơn hàng (admin only)
  getAllOrders: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const {
        search,
        startDate,
        endDate,
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        page = 1,
        limit = 20
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (pageNum - 1) * limitNum;

      let query = 'SELECT id, userId, customerName, customerEmail, totalPrice, totalItems, status, products, createdAt FROM orders WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (customerName LIKE ? OR customerEmail LIKE ? OR CAST(id AS TEXT) LIKE ?)';
        countQuery += ' AND (customerName LIKE ? OR customerEmail LIKE ? OR CAST(id AS TEXT) LIKE ?)';
        const searchValue = `%${sanitizeText(search)}%`;
        params.push(searchValue, searchValue, searchValue);
      }

      if (status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(sanitizeText(status));
      }

      if (startDate) {
        query += ' AND DATE(createdAt) >= DATE(?)';
        countQuery += ' AND DATE(createdAt) >= DATE(?)';
        params.push(sanitizeText(startDate));
      }

      if (endDate) {
        query += ' AND DATE(createdAt) <= DATE(?)';
        countQuery += ' AND DATE(createdAt) <= DATE(?)';
        params.push(sanitizeText(endDate));
      }

      const validSortColumns = ['createdAt', 'totalPrice', 'customerName', 'status'];
      const validSortOrders = ['ASC', 'DESC'];
      const sortField = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
      const sortDirection = validSortOrders.includes((sortOrder || '').toUpperCase()) ? (sortOrder || '').toUpperCase() : 'DESC';
      query += ` ORDER BY ${sortField} ${sortDirection}`;
      query += ' LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      const connection = await pool.getConnection();

      try {
        const countParams = limitNum !== null ? params.slice(0, params.length - 2) : params;
        const [countResult] = await connection.execute(countQuery, countParams);
        const total = countResult[0]?.total || 0;
        const [orders] = await connection.execute(query, params);

        return res.status(200).json({
          message: 'Orders retrieved',
          count: orders.length,
          orders,
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
      console.error('Get orders error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy đơn hàng của user hiện tại
  getMyOrders: async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const {
        search,
        startDate,
        endDate,
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        page = 1,
        limit = 20
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (pageNum - 1) * limitNum;

      let query = 'SELECT id, customerName, customerEmail, totalPrice, totalItems, status, createdAt FROM orders WHERE userId = ?';
      let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE userId = ?';
      const params = [req.user.id];

      if (search) {
        query += ' AND (customerName LIKE ? OR customerEmail LIKE ? OR CAST(id AS TEXT) LIKE ?)';
        countQuery += ' AND (customerName LIKE ? OR customerEmail LIKE ? OR CAST(id AS TEXT) LIKE ?)';
        const searchValue = `%${sanitizeText(search)}%`;
        params.push(searchValue, searchValue, searchValue);
      }

      if (status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(sanitizeText(status));
      }

      if (startDate) {
        query += ' AND DATE(createdAt) >= DATE(?)';
        countQuery += ' AND DATE(createdAt) >= DATE(?)';
        params.push(sanitizeText(startDate));
      }

      if (endDate) {
        query += ' AND DATE(createdAt) <= DATE(?)';
        countQuery += ' AND DATE(createdAt) <= DATE(?)';
        params.push(sanitizeText(endDate));
      }

      const validSortColumns = ['createdAt', 'totalPrice', 'status'];
      const validSortOrders = ['ASC', 'DESC'];
      const sortField = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
      const sortDirection = validSortOrders.includes((sortOrder || '').toUpperCase()) ? (sortOrder || '').toUpperCase() : 'DESC';
      query += ` ORDER BY ${sortField} ${sortDirection}`;
      query += ' LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      const connection = await pool.getConnection();

      try {
        const countParams = limitNum !== null ? params.slice(0, params.length - 2) : params;
        const [countResult] = await connection.execute(countQuery, countParams);
        const total = countResult[0]?.total || 0;
        const [orders] = await connection.execute(query, params);

        return res.status(200).json({
          message: 'Your orders',
          count: orders.length,
          orders,
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
      console.error('Get my orders error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (req, res) => {
    try {
      const { orderId } = req.params;

      const connection = await pool.getConnection();

      try {
        const [orders] = await connection.execute(
          `SELECT * FROM orders WHERE id = ?`,
          [sanitizeText(orderId)]
        );

        if (orders.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        if (!req.user?.isAdmin && Number(order.userId) !== Number(req.user?.id)) {
          return res.status(403).json({ message: 'Access denied to this order' });
        }

        order.products = JSON.parse(order.products);

        return res.status(200).json({
          message: 'Order details',
          order
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get order details error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy lịch sử trạng thái đơn hàng
  getOrderStatusHistory: async (req, res) => {
    try {
      const { orderId } = req.params;

      const connection = await pool.getConnection();

      try {
        const [orders] = await connection.execute(
          'SELECT userId FROM orders WHERE id = ?',
          [sanitizeText(orderId)]
        );

        if (orders.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];
        if (!req.user?.isAdmin && Number(order.userId) !== Number(req.user?.id)) {
          return res.status(403).json({ message: 'Access denied to this order history' });
        }

        const [history] = await connection.execute(
          `SELECT osh.*, u.name as changedByName
           FROM order_status_history osh
           LEFT JOIN users u ON osh.changedBy = u.id
           WHERE osh.orderId = ?
           ORDER BY osh.createdAt DESC`,
          [sanitizeText(orderId)]
        );

        return res.status(200).json({
          message: 'Order status history retrieved',
          history
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get order status history error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { orderId } = req.params;
      const { status, notes } = req.body;

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const connection = await pool.getConnection();

      try {
        // Get current order status
        const [currentOrder] = await connection.execute(
          'SELECT status FROM orders WHERE id = ?',
          [orderId]
        );

        if (currentOrder.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = currentOrder[0].status;

        // Only update if status is different
        if (oldStatus === status) {
          return res.status(200).json({
            message: 'Order status unchanged',
            orderId,
            status
          });
        }

        // Update order status
        await connection.execute(
          `UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
          [status, orderId]
        );

        // Insert status history
        await connection.execute(
          `INSERT INTO order_status_history (orderId, oldStatus, newStatus, changedBy, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, oldStatus, status, req.user.id, notes || null]
        );

        await syncDeliveredOrderTransactions();

        return res.status(200).json({
          message: 'Order status updated',
          orderId,
          status,
          oldStatus
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Update order status error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = ordersController;
