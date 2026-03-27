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

// GET /api/auth/users (Admin only - xem danh sách tất cả users)
router.get('/users', verifyToken, verifyAdmin, authController.getAllUsers);

module.exports = router;
