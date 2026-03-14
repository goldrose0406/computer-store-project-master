const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { pool } = require('../config/db');

const authController = {
  // Đăng ký
  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validate input
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const connection = await pool.getConnection();

      try {
        // Kiểm tra email tồn tại
        const [existingUser] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Tạo user
        await connection.execute(
          'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, false]
        );

        // Tạo token
        const token = jwt.sign(
          { email, name, isAdmin: false },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.status(201).json({
          message: 'Register successful',
          token,
          user: { name, email, isAdmin: false }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const connection = await pool.getConnection();

      try {
        // Tìm user
        const [users] = await connection.execute(
          'SELECT id, name, email, password, isAdmin FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Tạo token
        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: { 
            id: user.id,
            name: user.name, 
            email: user.email, 
            isAdmin: user.isAdmin 
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Verify token (kiểm tra token có hợp lệ không)
  verifyToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        message: 'Token is valid',
        user: decoded
      });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
};

module.exports = authController;
