# 🎯 Hệ Thống Cửa Hàng Bán Máy Tính - Hướng Dẫn Demo

## 📋 Giới Thiệu
Đây là một hệ thống e-commerce hoàn chỉnh cho cửa hàng bán máy tính, bao gồm:
- **Backend API RESTful** với authentication, products, orders management
- **Frontend React** với UI đẹp, responsive design, và client-side routing
- **Database MySQL** với user, products, orders tables
- **Postman Collection** để test API

---

## 🚀 Cài Đặt & Chạy Dự Án

### 1. Backend Setup

#### Bước 1: Cài đặt dependencies
```bash
cd backend
npm install
```

#### Bước 2: Tạo .env file (nếu chưa có)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=computerstore
PORT=5000
JWT_SECRET=your-secret-key-computer-store-2024
JWT_EXPIRE=7d
```

#### Bước 3: Chạy server
```bash
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
```

**Kết quả:** Server chạy tại `http://localhost:5000`

---

### 2. Frontend Setup

#### Bước 1: Cài đặt dependencies
```bash
cd frontend
npm install
```

#### Bước 2: Tạo .env file (nếu chưa có)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Bước 3: Chạy frontend
```bash
npm start
```

**Kết quả:** Ứng dụng mở tại `http://localhost:3000`

---

## 🧪 Testing

### A. Test API với Postman

#### Bước 1: Import Collection
1. Mở Postman
2. Click **File** → **Import**
3. Chọn file: `backend/POSTMAN_COLLECTION.json`
4. Click **Import**

#### Bước 2: Lưu JWT Token
Sau khi login, copy token từ response và thêm vào Postman variables:
1. Click **Variables** tab
2. Set `jwt_token` = token từ response

---

### B. Test Flow (Step-by-Step)

#### **1. Authentication Flow** 🔐
```
1. Register → POST /api/auth/register
   - Body: {"name": "User", "email": "user@example.com", "password": "123456", "confirmPassword": "123456"}
   - Response: token, user info

2. Login → POST /api/auth/login
   - Body: {"email": "admin@computerstore.com", "password": "Admin@123"}
   - Response: token, user info, isAdmin: true

3. Verify → GET /api/auth/verify
   - Header: Authorization: Bearer {{jwt_token}}
   - Response: user data
```

#### **2. Products API** 🛍️
```
GET /api/products
   - Response: Danh sách tất cả sản phẩm (seed data 6 items)

GET /api/products?brand=Macbook
   - Response: Sản phẩm theo thương hiệu

GET /api/products/1
   - Response: Chi tiết 1 sản phẩm

GET /api/products/brands
   - Response: Danh sách brands

GET /api/products/categories
   - Response: Danh sách categories

POST /api/products (Admin only)
   - Header: Authorization: Bearer {{jwt_token}}
   - Body: Product data
   - Response: New product created

PATCH /api/products/1 (Admin only)
   - Header: Authorization: Bearer {{jwt_token}}
   - Body: Updates
   - Response: Updated

DELETE /api/products/1 (Admin only)
   - Header: Authorization: Bearer {{jwt_token}}
   - Response: Deleted
```

#### **3. Orders API** 📦
```
POST /api/orders/create (Requires login)
   - Header: Authorization: Bearer {{jwt_token}}
   - Body: {"customerName": "", "customerEmail": "", "customerPhone": "", "customerAddress": "", "products": [], "totalPrice": 0}
   - Response: Order created with orderId

GET /api/orders/my-orders (Requires login)
   - Header: Authorization: Bearer {{jwt_token}}
   - Response: User's orders

GET /api/orders/1
   - Header: Authorization: Bearer {{jwt_token}}
   - Response: Order details

GET /api/orders (Admin only)
   - Header: Authorization: Bearer {{jwt_token}}
   - Response: All orders

PATCH /api/orders/1/status (Admin only)
   - Header: Authorization: Bearer {{jwt_token}}
   - Body: {"status": "shipped"}
   - Response: Updated
```

---

### C. Test Flow (Giao Diện Web)

#### **Scenario 1: Khách hàng mua hàng**
```
1. Vào http://localhost:3000 (Homepage)
   ✓ Xem carousel, categories, products

2. Click "Xem tất cả sản phẩm" → ProductListPage
   ✓ Xem danh sách 6 sản phẩm
   ✓ Lọc theo thương hiệu
   ✓ Sắp xếp theo giá

3. Click sản phẩm → ProductDetailPage
   ✓ Xem chi tiết, thông số kỹ thuật
   ✓ Thêm vào giỏ hàng

4. Click "🛒 Giỏ hàng" (CartSidebar)
   ✓ Xem sản phẩm, số lượng, tổng tiền
   ✓ Xóa sản phẩm
   ✓ Click "Thanh toán" → CheckoutPage

5. CheckoutPage
   ✓ Form điền thông tin khách (pre-fill nếu đã login)
   ✓ Xem tổng tiền
   ✓ Click "Đặt hàng"
   
   → Redirect to Login (nếu chưa login)

6. LoginPage
   ✓ Đăng nhập hoặc Đăng ký
   ✓ Demo account: admin@computerstore.com / Admin@123

7. Quay lại CheckoutPage → Click "Đặt hàng"
   ✓ Order created successfully
   ✓ Redirect to OrderSuccessPage

8. OrderSuccessPage
   ✓ Xem chi tiết đơn hàng vừa tạo
   ✓ Mã đơn hàng được hiển thị
```

#### **Scenario 2: Admin quản lý**
```
1. Login với admin account
   - Email: admin@computerstore.com
   - Password: Admin@123

2. Click "Admin Dashboard" (Navbar)
   ✓ Xem thống kê: Tổng đơn, Sản phẩm, Doanh thu, Khách

3. Tab "Quản lý đơn hàng"
   ✓ Xem tất cả đơn hàng
   ✓ Cập nhật trạng thái: pending → processing → shipped → delivered

4. Tab "Quản lý sản phẩm"
   ✓ Xem danh sách sản phẩm
   ✓ Click "Thêm sản phẩm mới"
   ✓ Điền thông tin, save
   ✓ Xóa sản phẩm
```

#### **Scenario 3: Xem đơn hàng của mình**
```
1. Login với tài khoản khách
   - Email: user@example.com
   - Password: 123456
   
2. Click "Đơn hàng" (Navbar)
   ✓ Xem danh sách đơn hàng của mình
   ✓ Click "Xem chi tiết" → Modal hiển thị chi tiết đơn hàng
```

---

## ✅ Đánh Giá Theo Yêu Cầu

### Week 10-12: Requirements (API/Backend)

#### 1. RESTful API ✅
- [x] **GET /api/products** - Lấy danh sách sản phẩm
- [x] **POST /api/products** - Thêm sản phẩm (admin)
- [x] **PATCH /api/products/:id** - Sửa sản phẩm (admin)
- [x] **DELETE /api/products/:id** - Xóa sản phẩm (admin)
- [x] **POST /api/orders/create** - Tạo đơn hàng
- [x] **GET /api/orders** - Lấy tất cả đơn (admin)
- [x] **PATCH /api/orders/:id/status** - Cập nhật trạng thái (admin)

#### 2. Authentication Flow ✅
- [x] **POST /api/auth/register** - Đăng ký user
- [x] **POST /api/auth/login** - Đăng nhập
- [x] **GET /api/auth/verify** - Kiểm tra token
- [x] JWT Token được lưu trong localStorage
- [x] API request gửi token trong Authorization header
- [x] Admin endpoint yêu cầu isAdmin = true

#### 3. Integration ✅
- [x] Frontend gọi API để lấy products
- [x] Frontend gọi API để tạo order
- [x] Dữ liệu được lưu vào Database
- [x] Order link đến User ID

#### 4. Validation ✅
- [x] **Email validation** - Format @domain
- [x] **Price validation** - Phải > 0
- [x] **Required fields** - Kiểm tra tất cả fields bắt buộc
- [x] **Error responses** - 400 (validation), 401 (auth), 403 (forbidden), 422 (unprocessable)

#### 5. Security ✅
- [x] **Password hashing** - bcryptjs hash password
- [x] **JWT token** - Expire time 7d
- [x] **Admin check** - API verify isAdmin role

---

### Week 10: Requirements (Frontend)

#### 1. UI/UX ✅
- [x] **Homepage** - Carousel, categories, featured products
- [x] **ProductListPage** - Grid layout, filters, pagination
- [x] **ProductDetailPage** - Full product info, specs
- [x] **CheckoutPage** - Form, order summary
- [x] **AdminDashboard** - Stats, tables, modals
- [x] **Beautiful Design** - Ant Design components

#### 2. Components ✅
- [x] **Navbar** - Navigation links
- [x] **CartSidebar** - Shopping cart display
- [x] **ProductCard** - Reusable product card
- [x] **CategorySection** - Category showcase
- [x] **Footer** - Footer links
- [x] **ProtectedRoute** - Admin route protection

#### 3. Responsive ✅
- [x] **Mobile** - Works on small screens
- [x] **Tablet** - Optimized layout
- [x] **Desktop** - Full width layout
- [x] **CSS Grid/Flex** - Responsive positioning

#### 4. Routing ✅
- [x] **Client-side routing** - React Router v6
- [x] **Navigation** - Links without page reload
- [x] **Route protection** - Admin routes
- [x] **Redirect** - Login redirect when needed

#### 5. State Management ✅
- [x] **AuthContext** - User authentication state
- [x] **CartContext** - Shopping cart state
- [x] **API integration** - Fetch from backend

---

## 📊 Database Structure

### Users Table
```sql
id (PK) | name | email (UQ) | password (HASH) | isAdmin | createdAt | updatedAt
```

### Products Table
```sql
id (PK) | name | brand | category | price | originalPrice | description | specs (JSON) | image | createdAt | updatedAt
```

### Orders Table
```sql
id (PK) | userId (FK) | customerName | customerEmail | customerPhone | customerAddress | products (JSON) | totalPrice | totalItems | status | notes | createdAt | updatedAt
```

---

## 🐛 Troubleshooting

### Backend không chạy
```bash
# Kiểm tra port 5000
lsof -i :5000

# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Kiểm tra database connection
# Chắc chắn MySQL chạy
```

### Frontend không kết nối API
```bash
# Kiểm tra .env file
REACT_APP_API_URL=http://localhost:5000/api

# Xóa browser cache
# Kiểm tra console cho errors
```

### Database không tạo
```bash
# Tạo MySQL host
MySQL bắt đầu
# Kiểm tra .env file DB_HOST, DB_USER, DB_PASSWORD
```

---

## 📝 Tài Liệu Thêm

- API Docs: Xem PostmanCollection.json
- Frontend Demo: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API Health: http://localhost:5000/health

---

## ✨ Features Highlights

- ✅ **6 Products** (Macbook, Asus, Lenovo, Acer, MSI)
- ✅ **Admin Account** (admin@computerstore.com / Admin@123)
- ✅ **Complete Auth Flow** (Register, Login, Token Verify)
- ✅ **CRUD Operations** (Products, Orders)
- ✅ **Order Management** (Create, View, Update Status)
- ✅ **Shopping Cart** (Add, Remove, Update Quantity)
- ✅ **Admin Dashboard** (Statistics, Product Management, Order Management)
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **Input Validation** (Email, Price, Required Fields)
- ✅ **Security** (Password Hashing, JWT Token, Role-based Access)

---

## 🎓 Project Architecture

```
computer-store-project/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ordersController.js
│   │   └── productsController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   ├── db.js
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductListPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrderSuccessPage.js
│   │   │   ├── MyOrdersPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   ├── Navbar.js
│   │   │   ├── CartSidebar.js
│   │   │   ├── CategorySection.js
│   │   │   ├── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   └── services/
│   │       ├── authService.js
│   │       ├── productsService.js
│   │       └── ordersService.js
│   └── package.json
```

---

**Tạo lúc:** March 21, 2026
**Status:** ✅ Production Ready
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
