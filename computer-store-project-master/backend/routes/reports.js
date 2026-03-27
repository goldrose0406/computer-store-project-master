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
const { auth, adminAuth } = require('../middleware/auth');

// Mock data - Replace with real database queries
const generateMockData = () => {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    revenueByMonth: months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 100) + 30
    })),
    orderStatus: {
      pending: Math.floor(Math.random() * 50) + 10,
      confirmed: Math.floor(Math.random() * 100) + 50,
      shipped: Math.floor(Math.random() * 80) + 40,
      delivered: Math.floor(Math.random() * 150) + 100
    },
    topProducts: [
      { id: 1, name: 'Laptop Dell XPS 13', sales: 45, revenue: 44955 },
      { id: 2, name: 'MacBook Pro 14"', sales: 38, revenue: 57200 },
      { id: 3, name: 'Laptop Asus ROG', sales: 32, revenue: 48000 },
      { id: 4, name: 'Lenovo ThinkPad', sales: 28, revenue: 25200 },
      { id: 5, name: 'MSI Gaming Laptop', sales: 22, revenue: 19800 }
    ],
    dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 5000) + 1000
    }))
  };
};

/**
 * GET /api/reports/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', auth, adminAuth, (req, res) => {
  try {
    const mockData = generateMockData();
    const totalOrders = Object.values(mockData.orderStatus).reduce((a, b) => a + b, 0);
    const totalRevenue = mockData.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
    
    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      totalProducts: 12,
      totalCustomers: Math.floor(Math.random() * 200) + 100,
      revenueByMonth: mockData.revenueByMonth,
      orderStatus: mockData.orderStatus,
      topProducts: mockData.topProducts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

/**
 * GET /api/reports/revenue
 * Get revenue trends
 */
router.get('/revenue', auth, adminAuth, (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const mockData = generateMockData();
    const dailyData = mockData.dailyRevenue.slice(-days);
    
    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue data', error: error.message });
  }
});

/**
 * GET /api/reports/orders
 * Get order statistics
 */
router.get('/orders', auth, adminAuth, (req, res) => {
  try {
    const mockData = generateMockData();
    
    res.json({
      byStatus: mockData.orderStatus,
      byBrand: {
        'Laptop': Math.floor(Math.random() * 100) + 50,
        'Desktop': Math.floor(Math.random() * 60) + 20,
        'Accessories': Math.floor(Math.random() * 40) + 10
      },
      dailyOrders: mockData.revenueByMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order data', error: error.message });
  }
});

module.exports = router;
