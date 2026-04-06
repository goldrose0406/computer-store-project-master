# 📋 SUMMARY - CHANGES MADE

## ✅ Hoàn Thành

### 1. **Migrations System** ✨
- ✅ Tạo folder `backend/migrations/`
- ✅ File `001_initial_schema.js` - tạo bảng users, orders, products
- ✅ File `002_add_role_column.js` - thêm role column
- ✅ File `backend/config/runMigrations.js` - runner script
- ✅ Thêm `"migrate"` script vào package.json

### 2. **Role System (3 loại)** 👥
- ✅ Thêm `role` column vào bảng users (admin, staff, customer)
- ✅ Mặc định: register → role = "customer"
- ✅ Admin có thể đổi role của user bằng PUT endpoint

### 3. **Backend Updates** 🔧

#### `backend/config/db.js`
- ✅ Thêm role column vào schema
- ✅ Tạo Staff account mặc định (staff@computerstore.com / Staff@123)
- ✅ Tạo Admin account mặc định (admin@computerstore.com / Admin@123)

#### `backend/controllers/authController.js`
- ✅ Register: set role = 'customer' mặc định
- ✅ Login: trả về role trong response
- ✅ Token JWT: chứa role, isAdmin
- ✅ **NEW**: Hàm `updateUserRole()` - đổi role user (admin only)

#### `backend/routes/auth.js`
- ✅ **NEW**: Endpoint `PUT /api/auth/users/:userId/role`
- ✅ Admin only protection

### 4. **Documentation** 📚
- ✅ `ROLES_AND_MIGRATIONS_GUIDE.md` - hướng dẫn toàn bộ
- ✅ `API_ROLE_TESTING.md` - test cases + curl commands

---

## 📊 Database Schema

### Bảng `users` (cập nhật)

| Column | Type | Default | Ghi chú |
|--------|------|---------|---------|
| id | INTEGER PRIMARY KEY | autoincrement | |
| name | VARCHAR(100) | - | |
| email | VARCHAR(100) | - | unique |
| password | VARCHAR(255) | - | bcrypt hash |
| **role** | TEXT | 'customer' | **NEW** - admin/staff/customer |
| isAdmin | BOOLEAN | 0 | giữ cho compatibility |
| createdAt | DATETIME | CURRENT_TIMESTAMP | |
| updatedAt | DATETIME | CURRENT_TIMESTAMP | |

---

## 🔄 Default Accounts

**Tạo tự động khi chạy `npm start`:**

### Admin
```
Email: admin@computerstore.com
Password: Admin@123
Role: admin
isAdmin: 1
```

### Staff  
```
Email: staff@computerstore.com
Password: Staff@123
Role: staff
isAdmin: 0
```

---

## 🚀 Cách Chạy

### 1. Chạy Migrations (tùy chọn)
```bash
cd backend
npm run migrate
```

### 2. Chạy Server
```bash
npm start
```

Server sẽ:
- Tạo bảng (nếu chưa có)
- Thêm role column (nếu chưa có)
- Tạo Admin + Staff accounts

---

## 📡 API Endpoints

### Register (Mặc định role = customer)
```
POST /api/auth/register
Body: { name, email, password, confirmPassword }
Response: { message, token, user: { role: 'customer', ... } }
```

### Login (Bao gồm role)
```
POST /api/auth/login
Body: { email, password }
Response: { message, token, user: { role, isAdmin, ... } }
```

### Get All Users (Admin only)
```
GET /api/auth/users
Headers: Authorization: Bearer ADMIN_TOKEN
Response: { count, users: [...] }
```

### Update User Role (Admin only) ⭐ NEW
```
PUT /api/auth/users/:userId/role
Headers: Authorization: Bearer ADMIN_TOKEN
Body: { newRole: 'staff' | 'admin' | 'customer' }
Response: { message, userId, newRole }
```

---

## 🎯 Thay Đổi Chính

### Register Endpoint
```javascript
// TRƯỚC
INSERT INTO users (name, email, password, isAdmin) VALUES (...)
// Dữ liệu: { isAdmin: false }

// SAU
INSERT INTO users (name, email, password, role, isAdmin) VALUES (...)
// Dữ liệu: { role: 'customer', isAdmin: false }
```

### JWT Token
```javascript
// TRƯỚC
jwt.sign({ email, name, isAdmin: false }, ...)

// SAU
jwt.sign({ email, name, role: 'customer', isAdmin: false }, ...)
```

### Response
```javascript
// TRƯỚC
user: { name, email, isAdmin: false }

// SAU
user: { name, email, role: 'customer', isAdmin: false }
```

---

## 📂 Files Tạo/Sửa

### Tạo Mới (New Files)
```
✅ backend/migrations/001_initial_schema.js
✅ backend/migrations/002_add_role_column.js
✅ backend/config/runMigrations.js
✅ ROLES_AND_MIGRATIONS_GUIDE.md
✅ API_ROLE_TESTING.md
```

### Sửa (Modified Files)
```
✅ backend/config/db.js (thêm role column, staff account)
✅ backend/controllers/authController.js (register, login, updateUserRole)
✅ backend/routes/auth.js (thêm updateUserRole endpoint)
✅ backend/package.json (thêm migrate script)
```

---

## ✨ Tính Năng Mới Thêm

| Tính Năng | Trước | Sau |
|-----------|-------|-----|
| Loại user | 2 (Admin/User) | 3 (Admin/Staff/Customer) |
| Register role | Luôn = User | = Customer |
| Đổi role | ❌ Không có | ✅ Admin endpoint |
| Migrations | ❌ Không có | ✅ Có hệ thống |
| Default accounts | Only Admin | Admin + Staff |

---

## 🧪 Test Cases

✅ Đăng ký → role = customer
✅ Đăng nhập admin → nhận role + token  
✅ Admin xem danh sách users
✅ Admin đổi role user
✅ Customer không thể đổi role (lỗi 403)
✅ Invalid role → lỗi validation
✅ User không tìm thấy → lỗi 404
✅ Invalid token → lỗi 401

---

## 🎓 Migrations Explained

**Migrations là gì?**
- Các file điều khiển thay đổi database schema
- Tính toàn vẹn + an toàn + dễ rollback
- Best practice trong phát triển web

**Tại sao cần?**
- ✅ Quản lý version schema
- ✅ Dễ collaborate team
- ✅ Deployment tự động
- ✅ Lịch sử rõ ràng

---

## 🚨 Lưu Ý Quan Trọng

1. **Database format**: SQLite (không phải MySQL)
   - SQLite không hỗ trợ DROP COLUMN trực tiếp
   - Migration 002 sẽ fail nếu column đã tồn tại (ignore)

2. **Backward Compatibility**: 
   - Giữ `isAdmin` field để không break existing code
   - Frontend vẫn dùng được `isAdmin` cũ

3. **JWT Token**:
   - Token chứa role + isAdmin
   - Frontend có thể dùng cả hai

4. **Default Accounts**:
   - Tạo tự động khi init database
   - Nếu chạy lại, sẽ skip (UNIQUE constraint)

---

## 📅 Next Steps (Tùy chọn)

- [ ] Thêm middleware `verifyRole()` che chi tiết theo role
- [ ] Update Admin Dashboard UI để quản lý roles
- [ ] Thêm audit log (ghi nhật ký thay đổi)
- [ ] Thêm soft delete cho users
- [ ] Thêm permission system (granular access)

---

**Date**: April 6, 2026  
**Status**: ✅ Complete  
**Tested**: Ready for deployment
