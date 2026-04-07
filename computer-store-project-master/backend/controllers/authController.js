const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { pool } = require('../config/db');
const { sendResetCode, sendPasswordChangeConfirmation } = require('../services/emailService');

// Hàm tạo mã reset password 6 số
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

        // Tạo user với role mặc định là 'customer'
        await connection.execute(
          'INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)',
          [name, email, hashedPassword, 'customer', false]
        );

        // Tạo token
        const token = jwt.sign(
          { email, name, role: 'customer', isAdmin: false },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.status(201).json({
          message: 'Register successful',
          token,
          user: { name, email, role: 'customer', isAdmin: false }
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
          'SELECT id, name, email, password, role, isAdmin FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Mật khẩu sai' });
        }

        // Tạo token
        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.name, role: user.role, isAdmin: user.isAdmin },
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
            role: user.role,
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
  },

  // Lấy danh sách tất cả users (Admin only)
  getAllUsers: async (req, res) => {
    try {
      console.log('🔍 getAllUsers called');
      console.log('req.user:', req.user);
      
      // Kiểm tra permission
      if (!req.user?.isAdmin) {
        console.error('❌ User is not admin. isAdmin:', req.user?.isAdmin);
        return res.status(403).json({ message: 'Admin access required', user: req.user });
      }

      const connection = await pool.getConnection();

      try {
        const [users] = await connection.execute(
          'SELECT id, name, email, role, isAdmin, createdAt FROM users ORDER BY createdAt DESC'
        );

        console.log('✅ Users retrieved successfully. Count:', users.length);
        
        return res.status(200).json({
          message: 'Users retrieved successfully',
          count: users.length,
          users: users
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('❌ Get users error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Đổi role user (Admin only)
  updateUserRole: async (req, res) => {
    try {
      // Kiểm tra permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { userId } = req.params;  // Lấy từ URL path
      const { newRole } = req.body;   // Lấy từ request body

      // Validate role
      const validRoles = ['customer', 'staff', 'admin'];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: `Invalid role. Must be: ${validRoles.join(', ')}` });
      }

      const connection = await pool.getConnection();

      try {
        // Kiểm tra user tồn tại
        const [existingUser] = await connection.execute(
          'SELECT id, role FROM users WHERE id = ?',
          [userId]
        );

        if (existingUser.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật role
        const isAdmin = newRole === 'admin' ? 1 : 0;
        await connection.execute(
          'UPDATE users SET role = ?, isAdmin = ? WHERE id = ?',
          [newRole, isAdmin, userId]
        );

        return res.status(200).json({
          message: `User role updated to ${newRole}`,
          userId,
          newRole,
          isAdmin
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Update user role error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Quên mật khẩu - Gửi mã reset
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const connection = await pool.getConnection();

      try {
        // Kiểm tra user tồn tại
        const [users] = await connection.execute(
          'SELECT id, name, email FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          // Không tiết lộ rằng email không tồn tại (security)
          return res.status(200).json({ 
            message: 'If an account exists with this email, a reset code has been sent' 
          });
        }

        const user = users[0];

        // Tạo reset code
        const resetCode = generateResetCode();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

        // Lưu reset code vào database
        await connection.execute(
          'UPDATE users SET reset_code = ?, reset_code_expires = ?, reset_attempts = 0, last_reset_attempt = ? WHERE id = ?',
          [resetCode, resetCodeExpires, new Date(), user.id]
        );

        // Gửi email
        const emailResult = await sendResetCode(email, resetCode);

        if (!emailResult.success) {
          return res.status(500).json({ 
            message: 'Failed to send reset code',
            error: emailResult.error 
          });
        }

        return res.status(200).json({
          message: 'Reset code sent to email successfully',
          email: email
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Xác minh reset code
  verifyResetCode: async (req, res) => {
    try {
      const { email, resetCode } = req.body;

      // Validate input
      if (!email || !resetCode) {
        return res.status(400).json({ message: 'Email and reset code are required' });
      }

      const connection = await pool.getConnection();

      try {
        // Tìm user
        const [users] = await connection.execute(
          'SELECT id, reset_code, reset_code_expires, reset_attempts FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Kiểm tra reset code có tồn tại không
        if (!user.reset_code) {
          return res.status(400).json({ message: 'No reset code requested' });
        }

        // Kiểm tra reset code còn valid không
        if (new Date() > new Date(user.reset_code_expires)) {
          await connection.execute(
            'UPDATE users SET reset_code = NULL, reset_code_expires = NULL WHERE id = ?',
            [user.id]
          );
          return res.status(400).json({ message: 'Reset code expired. Please request a new one' });
        }

        // Kiểm tra số lần nhập sai (tối đa 5 lần)
        if (user.reset_attempts >= 5) {
          return res.status(429).json({ 
            message: 'Too many failed attempts. Please request a new code' 
          });
        }

        // Kiểm tra reset code có đúng không
        if (user.reset_code !== resetCode) {
          // Tăng counter lỗi
          await connection.execute(
            'UPDATE users SET reset_attempts = reset_attempts + 1 WHERE id = ?',
            [user.id]
          );
          return res.status(400).json({ 
            message: 'Invalid reset code',
            attemptsRemaining: 5 - (user.reset_attempts + 1)
          });
        }

        return res.status(200).json({
          message: 'Reset code verified successfully'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Verify reset code error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (req, res) => {
    try {
      const { email, resetCode, newPassword, confirmPassword } = req.body;

      // Validate input
      if (!email || !resetCode || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const connection = await pool.getConnection();

      try {
        // Tìm user
        const [users] = await connection.execute(
          'SELECT id, name, reset_code, reset_code_expires FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Kiểm tra reset code
        if (user.reset_code !== resetCode) {
          return res.status(400).json({ message: 'Invalid reset code' });
        }

        // Kiểm tra reset code còn valid không
        if (new Date() > new Date(user.reset_code_expires)) {
          return res.status(400).json({ message: 'Reset code expired' });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Cập nhật mật khẩu
        await connection.execute(
          'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL, reset_attempts = 0 WHERE id = ?',
          [hashedPassword, user.id]
        );

        // Gửi email xác nhận
        await sendPasswordChangeConfirmation(email, user.name);

        return res.status(200).json({
          message: 'Password reset successfully'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;
