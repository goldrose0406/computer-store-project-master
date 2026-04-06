const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/verify
router.get('/verify', verifyToken, authController.verifyToken);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/verify-reset-code
router.post('/verify-reset-code', authController.verifyResetCode);

// POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// GET /api/auth/users (Admin only - xem danh sách tất cả users)
router.get('/users', verifyToken, verifyAdmin, authController.getAllUsers);

// PUT /api/auth/users/:userId/role (Admin only - đổi role user)
router.put('/users/:userId/role', verifyToken, verifyAdmin, authController.updateUserRole);

module.exports = router;
