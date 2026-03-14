const express = require('express');
const ordersController = require('../controllers/ordersController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Public route - tạo order (YÊU CẦU TOKEN - phải login trước)
router.post('/create', verifyToken, ordersController.createOrder);

// Protected routes - cần login
router.get('/my-orders', verifyToken, ordersController.getMyOrders);
router.get('/:orderId', verifyToken, ordersController.getOrderDetails);

// Admin only routes
router.get('/', verifyToken, verifyAdmin, ordersController.getAllOrders);
router.patch('/:orderId/status', verifyToken, verifyAdmin, ordersController.updateOrderStatus);

module.exports = router;
