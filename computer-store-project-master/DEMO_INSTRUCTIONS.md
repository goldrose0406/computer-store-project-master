# 🧪 DEMO - Hệ Thống Đăng Nhập & Mua Hàng

## 📋 MỤC LỤC
1. [Demo Postman](#demo-postman)
2. [Demo Web UI](#demo-web-ui)
3. [Database Check](#database-check)

---

## 🔹 Demo Postman

### **BƯỚC 1: Import Collection**
1. Mở **Postman**
2. Click **File** → **Import**
3. Chọn file: `POSTMAN_COLLECTION.json` (trong `backend/` folder)
4. Click **Import**

### **BƯỚC 2: Set Environment Variable**
1. Truy cập tab **Variables**
2. Tìm `jwt_token` (chưa có giá trị)
3. Chúng ta sẽ set nó từ response của login

---

### **💡 TEST FLOW (Postman)**

#### **A. Test Register (Đăng ký)**
```
1. Click request: "Register New User"
2. Edit body - thay đổi email/password nếu muốn
3. Click Send
4. Response sẽ trả về token
```

**Response mẫu:**
```json
{
  "message": "Register successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "isAdmin": false
  }
}
```

---

#### **B. Test Login (Đăng nhập)**
```
1. Click request: "Login Admin"
2. Click Send
3. Copy token từ response
4. Paste vào Variables → jwt_token
```

**Lệnh Copy Token (trong Postman):**
- Mở **Tests** tab
- Paste code:
```javascript
var jsonData = pm.response.json();
pm.environment.set("jwt_token", jsonData.token);
```
- Click Send - token sẽ tự động save

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@computerstore.com",
    "isAdmin": true
  }
}
```

---

#### **C. Test Verify Token**
```
1. Click request: "Verify Token"
2. Click Send
3. Nếu token hợp lệ → 200 OK
```

**Response:**
```json
{
  "message": "Token is valid",
  "user": {
    "id": 1,
    "email": "admin@computerstore.com",
    "name": "Admin",
    "isAdmin": true
  }
}
```

---

#### **D. Test Create Order (Đặt hàng)**
```
1. Click request: "Create Order (No Auth)"
2. Có thể không cần login
3. Click Send
4. Kiểm tra response - sẽ có orderId
```

**Request Body:**
```json
{
  "customerName": "Trần Thị B",
  "customerEmail": "customer@example.com",
  "customerPhone": "0123456789",
  "customerAddress": "123 Đường ABC, Quận 1, TP. HCM",
  "products": [
    {
      "id": 1,
      "name": "Laptop Asus A15",
      "price": 15000000,
      "quantity": 1
    }
  ],
  "totalPrice": 15000000,
  "notes": "Giao hàng trước 5h chiều"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "orderId": 1,
  "order": {
    "id": 1,
    "customerName": "Trần Thị B",
    "customerEmail": "customer@example.com",
    "totalPrice": 15000000,
    "totalItems": 1,
    "status": "pending"
  }
}
```

---

#### **E. Test Get All Orders (Admin - xem tất cả đơn)**
```
1. Login admin trước (để lấy token)
2. Click request: "Get All Orders (Admin)"
3. Click Send
4. Chỉ admin mới xem được
```

---

#### **F. Test Update Order Status (Admin)**
```
1. Login admin trước
2. Click request: "Update Order Status (Admin)"
3. Thay đổi orderId: `1` thành id thực tế
4. Thay đổi status: "shipped" thành trạng thái khác
5. Click Send
```

---

## 🔹 Demo Web UI

### **BƯỚC 1: Truy cập Frontend**
```
http://localhost:3000
```

### **TEST FLOW (Web)**

#### **A. Đăng Ký**
```
1. Click "Đăng Ký" (trên Navbar)
2. Điền form: Tên, Email, Password
3. Click "Đăng Ký"
4. Tự động redirect homepage
5. Navbar hiển thị tên user
```

#### **B. Đăng Nhập Admin**
```
1. Logout nếu đã login
2. Click "Đăng nhập"
3. Email: admin@computerstore.com
4. Password: Admin@123
5. Click "Đăng nhập"
6. Sẽ redirect đến /admin (AdminDashboard)
```

#### **C. Mua Hàng (Checkout)**
```
1. Truy cập trang chủ
2. Thêm sản phẩm vào giỏ (click Add to Cart)
3. Click icon giỏ hàng (góc phải Navbar)
4. Click "Thanh toán" → Redirect /checkout
5. Điền thông tin giao hàng
6. Click "Đặt Hàng"
7. Đơn hàng sẽ được lưu vào database
```

---

## 🔹 Database Check

### **Xem MySQL Database**
```
1. Mở: http://localhost/phpmyadmin
2. Login (nếu cần)
3. Click database: computerstore
4. Chọn table: orders
5. Kiểm tra những đơn hàng vừa tạo
```

### **Bằng MySQL CLI**
```bash
mysql -u root computerstore

# Xem tất cả đơn hàng
SELECT * FROM orders;

# Xem chi tiết đơn hàng
SELECT id, customerName, customerEmail, totalPrice, status, createdAt FROM orders;
```

---

## ✅ CHECKLIST DEMO

### **Authentication ✅**
- [x] POST /api/auth/register - Đăng ký user mới
- [x] POST /api/auth/login - Đăng nhập, trả token
- [x] GET /api/auth/verify - Kiểm tra token hợp lệ

### **Orders ✅**
- [x] POST /api/orders/create - Tạo đơn hàng (public)
- [x] GET /api/orders - Xem tất cả orders (admin only)
- [x] GET /api/orders/my-orders - Xem orders của user
- [x] GET /api/orders/:id - Xem chi tiết order
- [x] PATCH /api/orders/:id/status - Update status (admin only)

### **Database ✅**
- [x] Users table - Lưu user + admin account
- [x] Orders table - Lưu đơn hàng
- [x] JSON products field - Lưu chi tiết sản phẩm

### **Website ✅**
- [x] Login/Register page
- [x] Checkout page
- [x] Protected admin route
- [x] User dropdown menu
- [x] Logout functionality

---

## 🎯 TỔNG KẾT

**Bạn đã hoàn thành:**
1. ✅ **Hệ thống xác thực** (Authentication) - JWT token
2. ✅ **Mô hình đơn hàng** (Orders) - Database + API
3. ✅ **Checkout UI** - Form lấy thông tin khách hàng
4. ✅ **Admin Dashboard** - Protected route, chỉ admin vào
5. ✅ **API Demo** - Postman collection

**Demo bằng:**
- 🧪 Postman (test API)
- 🌐 Web UI (test tính năng trang web)
- 🗄️ phpMyAdmin (kiểm tra database)

---

## 💡 GHI CHÚ

- ✅ Password được mã hóa (bcryptjs)
- ✅ Token JWT expires sau 7 ngày
- ✅ Validation input (email, phone, address)
- ✅ Admin-only routes được bảo vệ

**Tiếp theo có thể làm:**
- [ ] Payment gateway (Stripe/ZaloPay)
- [ ] Email notification
- [ ] Order tracking
- [ ] Customer reviews
