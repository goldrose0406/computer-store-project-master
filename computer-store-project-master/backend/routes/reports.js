/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: ['week', 'month', 'year']
 *           default: 'month'
 *         description: Period for statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                 totalOrders:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 totalCustomers:
 *                   type: integer
 *                 revenueByMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       revenue:
 *                         type: number
 *                 orderStatus:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: integer
 *                     confirmed:
 *                       type: integer
 *                     shipped:
 *                       type: integer
 *                     delivered:
 *                       type: integer
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       sales:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 * /api/reports/revenue:
 *   get:
 *     summary: Get revenue trends
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to show
 *     responses:
 *       200:
 *         description: Daily revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                   revenue:
 *                     type: number
 * 
 * /api/reports/orders:
 *   get:
 *     summary: Get order statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 byStatus:
 *                   type: object
 *                 byBrand:
 *                   type: object
 *                 dailyOrders:
 *                   type: array
 */

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');

// SQLite database connection
const dbPath = path.join(__dirname, '../computerstore.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

/**
 * GET /api/reports/dashboard
 * Get dashboard statistics (REAL DATA FROM DATABASE)
 */
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    // Get total orders count
    const totalOrdersResult = await dbGet(
      'SELECT COUNT(*) as count FROM orders'
    );
    const totalOrders = totalOrdersResult?.count || 0;

    // Get total revenue
    const totalRevenueResult = await dbGet(
      'SELECT SUM(totalPrice) as total FROM orders WHERE status IN ("confirmed", "shipped", "delivered")'
    );
    const totalRevenue = totalRevenueResult?.total || 0;

    // Get total products
    const totalProductsResult = await dbGet(
      'SELECT COUNT(*) as count FROM products'
    );
    const totalProducts = totalProductsResult?.count || 0;

    // Get unique customers (distinct emails)
    const totalCustomersResult = await dbGet(
      'SELECT COUNT(DISTINCT customerEmail) as count FROM orders'
    );
    const totalCustomers = totalCustomersResult?.count || 0;

    // Get revenue by month (last 12 months)
    const revenueByMonth = await dbAll(`
      SELECT 
        strftime('%m', createdAt) as monthNumber,
        strftime('%b', createdAt) as month,
        SUM(totalPrice) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE status IN ("confirmed", "shipped", "delivered")
      GROUP BY strftime('%m', createdAt)
      ORDER BY monthNumber ASC
      LIMIT 12
    `);

    // Get order status breakdown
    const orderStatusResults = await dbAll(`
      SELECT status, COUNT(*) as count FROM orders GROUP BY status
    `);
    
    const orderStatus = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0
    };
    
    orderStatusResults.forEach(item => {
      if (orderStatus.hasOwnProperty(item.status)) {
        orderStatus[item.status] = item.count;
      }
    });

    // Get top 5 products (by ID / most recent)
    const topProducts = await dbAll(`
      SELECT 
        id,
        name,
        price as revenue,
        1 as sales
      FROM products
      ORDER BY id DESC
      LIMIT 5
    `);

    res.json({
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
      totalOrders: totalOrders,
      totalProducts: totalProducts,
      totalCustomers: totalCustomers,
      revenueByMonth: revenueByMonth.map(item => ({
        month: item.month,
        revenue: Math.round(item.revenue),
        orders: item.orders
      })),
      orderStatus: orderStatus,
      topProducts: topProducts.map(item => ({
        id: item.id,
        name: item.name,
        sales: item.sales || 0,
        revenue: item.revenue || 0
      })),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

/**
 * GET /api/reports/revenue
 * Get revenue trends (REAL DATA FROM DATABASE)
 */
router.get('/revenue', auth, adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    const dailyRevenue = await dbAll(`
      SELECT 
        DATE(createdAt) as date,
        SUM(totalPrice) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE status IN ("confirmed", "shipped", "delivered")
        AND createdAt >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `, [days]);

    // Format dates nicely
    const formattedData = dailyRevenue.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ message: 'Error fetching revenue data', error: error.message });
  }
});

/**
 * GET /api/reports/orders
 * Get order statistics (REAL DATA FROM DATABASE)
 */
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    // Order status breakdown
    const statusResults = await dbAll(`
      SELECT status, COUNT(*) as count FROM orders GROUP BY status
    `);
    
    const byStatus = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0
    };
    
    statusResults.forEach(item => {
      if (byStatus.hasOwnProperty(item.status)) {
        byStatus[item.status] = item.count;
      }
    });

    // Orders by brand (from products)
    const brandResults = await dbAll(`
      SELECT 
        brand,
        COUNT(id) as count
      FROM products
      GROUP BY brand
      ORDER BY count DESC
      LIMIT 5
    `);
    
    const byBrand = {};
    brandResults.forEach(item => {
      byBrand[item.brand] = item.count;
    });

    // Daily orders (last 30 days)
    const dailyOrders = await dbAll(`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM orders
      WHERE createdAt >= datetime('now', '-30 days')
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `);

    const formattedDailyOrders = dailyOrders.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: item.count
    }));

    res.json({
      byStatus: byStatus,
      byBrand: byBrand,
      dailyOrders: formattedDailyOrders
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Error fetching order data', error: error.message });
  }
});

module.exports = router;
