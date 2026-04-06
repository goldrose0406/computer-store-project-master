# 🎯 HƯỚNG DẪN ROLES & MIGRATIONS - COMPUTER STORE

## 📍 1. DỮ LIỆU TÀI KHOẢN LƯU Ở ĐÂU?

**Tất cả dữ liệu được lưu trong SQLite Database:**
```
backend/computerstore.db
```

**Bảng `users` có các cột:**
```sql
- id                int (khóa chính, tự động tăng)
- name              text (tên người dùng)
- email             text (email duy nhất)
- password          text (mật khẩu hash)
- role              text (admin / staff / customer)  ← New!
- isAdmin           boolean (0 = không, 1 = có)
- createdAt         datetime (lúc tạo tài khoản)
- updatedAt         datetime (lúc cập nhật)
```

---

## ✅ 2. ROLE SYSTEM (3 LOẠI)

### Theo yêu cầu đồ án:

| Role | Mô tả | Quyền hạn |
|------|-------|---------|
| **admin** | Admin | Quản lý tất cả, đổi role user |
| **staff** | Nhân viên | Quản lý sản phẩm, đơn hàng |
| **customer** | Khách hàng | Mua sắm, xem đơn hàng của mình |

---

## 🚀 3. CÁCH CHẠY MIGRATIONS

### Step 1: Khởi động backend
```bash
cd backend
npm install
```

### Step 2: Chạy Migrations (tạo bảng + roles)
```bash
npm run migrate
```

**Output mong đợi:**
```
📦 Running migrations...

🔄 Executing: 001_initial_schema.js
✅ Migration 001: Users table created
✅ Migration 001: Orders table created
✅ Migration 001: Products table created

🔄 Executing: 002_add_role_column.js
✅ Migration 002: Role column added to users table

🎉 All migrations completed!
```

### Step 3: Chạy server
```bash
npm start
```

Server sẽ tự động:
- Tạo bảng users (nếu chưa có)
- Thêm column `role` (nếu chưa có)
- Tạo 2 tài khoản test:
  - **Admin**: admin@computerstore.com / Admin@123
  - **Staff**: staff@computerstore.com / Staff@123

---

## 📝 4. ĐĂNG KÝ MẶC ĐỊNH ROLE = "CUSTOMER"

**Khi user đăng ký:**
```javascript
// Frontend (RegisterPage.js)
// Tự động gửi lên, backend sẽ set role = 'customer'

POST /api/auth/register
{
  "name": "John Doe",
  "email": "user@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Backend sẽ:**
```javascript
// authController.js
await connection.execute(
  'INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)',
  [name, email, hashedPassword, 'customer', false]  ← role = 'customer' mặc định
);
```

**Response:**
```json
{
  "message": "Register successful",
  "token": "eyJhbGci...",
  "user": {
    "name": "John Doe",
    "email": "user@email.com",
    "role": "customer",
    "isAdmin": false
  }
}
```

---

## 🔐 5. ĐỔI ROLE TÀI KHOẢN (CHỈ ADMIN)

### API Endpoint:

**PUT /api/auth/users/:userId/role** (Admin only)

**Request:**
```json
{
  "userId": 3,
  "newRole": "staff"
}
```

**Response:**
```json
{
  "message": "User role updated to staff",
  "userId": 3,
  "newRole": "staff",
  "isAdmin": 0
}
```

### Cách dùng (curl):
```bash
curl -X PUT http://localhost:5000/api/auth/users/3/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newRole": "staff"}'
```

### Cách dùng (Postman):
1. **Method**: `PUT`
2. **URL**: `http://localhost:5000/api/auth/users/3/role`
3. **Headers**:
   - `Authorization: Bearer admin_token_here`
   - `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "newRole": "staff"
   }
   ```

### Quyền hạn:
- ✅ Chỉ **Admin** có thể đổi role
- ✅ Hợp lệ roles: `admin`, `staff`, `customer`
- ❌ Nếu không phải Admin → lỗi 403 Forbidden

---

## 📊 6. VIEW DANH SÁCH TẤT CẢ USERS

### API Endpoint:

**GET /api/auth/users** (Admin only)

**Response:**
```json
{
  "message": "Users retrieved successfully",
  "count": 3,
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@computerstore.com",
      "role": "admin",
      "isAdmin": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Staff",
      "email": "staff@computerstore.com",
      "role": "staff",
      "isAdmin": 0,
      "createdAt": "2024-01-15T10:30:01.000Z"
    },
    {
      "id": 3,
      "name": "John Doe",
      "email": "user@email.com",
      "role": "customer",
      "isAdmin": 0,
      "createdAt": "2024-02-20T14:25:00.000Z"
    }
  ]
}
```

---

## 📂 7. CẤU TRÚC FILE MIGRATIONS

```
backend/
├── config/
│   ├── db.js                    (database config)
│   ├── runMigrations.js         (migration runner script) ← NEW
│   └── seed.js                  (seed products)
├── migrations/                  ← NEW folder
│   ├── 001_initial_schema.js    (tạo bảng users, orders, products)
│   └── 002_add_role_column.js   (thêm role column)
├── controllers/
│   └── authController.js        (updated: dùng role)
└── package.json                 (added: "migrate" script)
```

---

## 💾 8. CACHE/RESET DATABASE

### ⚠️ Xóa toàn bộ database:
```bash
# Xóa file database
del backend/computerstore.db

# Hoặc trên Mac/Linux:
rm backend/computerstore.db

# Rồi chạy lại server - nó sẽ tạo database mới
npm start
```

### Chỉ reset users (giữ products):
```bash
# Chạy migration down (nếu cần)
# Hiện tại SQLite không hỗ trợ DROP COLUMN, nên cần xóa & tạo lại
```

---

## ✨ 9. AUTHENTICATION FLOW

### Đăng ký (Register):
```
User nhập form → Frontend gửi POST /api/auth/register → Backend hash password + set role='customer' → Lưu vào DB → Trả về JWT token
```

### Đăng nhập (Login):
```
User nhập email/password → Frontend gửi POST /api/auth/login → Backend verify password → Tạo JWT token kèm role → Trả về token
```

### JWT Token có chứa:
```json
{
  "id": 3,
  "email": "user@email.com",
  "name": "John Doe",
  "role": "customer",
  "isAdmin": false
}
```

---

## 🎓 10. KHÁI NIỆM MIGRATIONS

**Tại sao cần Migrations?**

❌ Cách **cũ** (không tốt):
```javascript
// Mỗi lần chạy server, tạo bảng từ đầu - dữ liệu bị mất
if (!tableExists) {
  createTable();
}
```

✅ Cách **mới** (Migrations):
```javascript
// File 001_initial_schema.js
// File 002_add_role_column.js
// Chạy lần lượt, ghi nhớ trạng thái
// => Dữ liệu không bị mất
```

**Lợi ích:**
- ✅ Kiểm soát từng thay đổi schema
- ✅ Dễ rollback nếu có lỗi
- ✅ Team collaborate được
- ✅ Deployment tự động (chỉ chạy migrate)
- ✅ Lịch sử thay đổi rõ ràng

---

## 🧪 ĐỀ XUẤT KỲ TIẾP

- [ ] Thêm frontend UI để quản lý roles (Admin Dashboard)
- [ ] Thêm middleware kiểm tra role per route
- [ ] Thêm soft delete (xóa mềm không xóa vĩnh viễn)
- [ ] Thêm audit log (ghi nhật ký mỗi lần đổi role)

---

**Tạo: April 6, 2026**
**Updated: Role System + Migrations Implementation**
