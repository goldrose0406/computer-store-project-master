const { pool } = require('../config/db');
const { sendOrderConfirmation } = require('../services/emailService');

const ordersController = {
  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, customerAddress, products, totalPrice, notes } = req.body;
      const userId = req.user?.id;

      // Validate - phải có user (token bắt buộc)
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Validate input
      if (!customerName || !customerEmail || !products || !totalPrice) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products array cannot be empty' });
      }

      const connection = await pool.getConnection();

      try {
        // ✅ CHECK STOCK FOR EACH PRODUCT
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

        // ✅ DEDUCT STOCK FROM PRODUCTS
        for (const item of products) {
          await connection.execute(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.id]
          );
        }

        // ✅ SEND ORDER CONFIRMATION EMAIL
        await sendOrderConfirmation(customerEmail, {
          orderId: result.insertId,
          customerName,
          products,
          totalPrice,
          totalItems
        });

        return res.status(201).json({
          message: 'Order created successfully',
          orderId: result.insertId,
          order: {
            id: result.insertId,
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

      const connection = await pool.getConnection();

      try {
        const [orders] = await connection.execute(
          `SELECT id, userId, customerName, customerEmail, totalPrice, totalItems, status, createdAt 
           FROM orders ORDER BY createdAt DESC LIMIT 100`
        );

        return res.status(200).json({
          message: 'Orders retrieved',
          count: orders.length,
          orders
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

      const connection = await pool.getConnection();

      try {
        const [orders] = await connection.execute(
          `SELECT id, customerName, customerEmail, totalPrice, totalItems, status, createdAt 
           FROM orders WHERE userId = ? ORDER BY createdAt DESC`,
          [req.user.id]
        );

        return res.status(200).json({
          message: 'Your orders',
          count: orders.length,
          orders
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
          [orderId]
        );

        if (orders.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];
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

  // Cập nhật trạng thái đơn hàng (admin only)
  updateOrderStatus: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { orderId } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const connection = await pool.getConnection();

      try {
        await connection.execute(
          `UPDATE orders SET status = ? WHERE id = ?`,
          [status, orderId]
        );

        return res.status(200).json({
          message: 'Order status updated',
          orderId,
          status
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
