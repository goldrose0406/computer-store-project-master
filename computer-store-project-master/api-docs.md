# Computer Store API

**Chào mừng đến với thư viện API của Computer Store!**

Dưới đây là tài liệu hướng dẫn sử dụng API chi tiết dành cho Lập trình viên, Tester và Admin hệ thống. Thiết kế API tuân theo chuẩn RESTful và sử dụng JSON để trao đổi dữ liệu giữa Frontend và Backend.

## 1. Thông tin chung

### Base URL

```txt
http://localhost:5000/api
```

### API Docs bằng Swagger

```txt
http://localhost:5000/api-docs
```

### Health Check

```txt
GET http://localhost:5000/health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2026-05-03T12:30:00.000Z"
}
```

## 2. Xác thực API

Các API cần đăng nhập sử dụng JWT token.

Header:

```txt
Authorization: Bearer <token>
Content-Type: application/json
```

Token được lấy sau khi đăng nhập thành công qua API:

```txt
POST /api/auth/login
```

## 3. Authentication API

Nhóm API dùng để đăng ký, đăng nhập, xác thực token, quên mật khẩu và quản lý người dùng.

### 3.1. Đăng ký tài khoản

```txt
POST /api/auth/register
```

Body:

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@gmail.com",
  "password": "User@123",
  "confirmPassword": "User@123"
}
```

Response thành công:

```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@gmail.com",
    "role": "customer"
  }
}
```

### 3.2. Đăng nhập

```txt
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@computerstore.com",
  "password": "Admin@123"
}
```

Response thành công:

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@computerstore.com",
    "role": "admin",
    "isAdmin": true
  }
}
```

### 3.3. Xác thực token

```txt
GET /api/auth/verify
```

Yêu cầu header:

```txt
Authorization: Bearer <token>
```

### 3.4. Quên mật khẩu

```txt
POST /api/auth/forgot-password
```

Body:

```json
{
  "email": "user@gmail.com"
}
```

### 3.5. Xác thực mã reset password

```txt
POST /api/auth/verify-reset-code
```

Body:

```json
{
  "email": "user@gmail.com",
  "code": "123456"
}
```

### 3.6. Đặt lại mật khẩu

```txt
POST /api/auth/reset-password
```

Body:

```json
{
  "email": "user@gmail.com",
  "code": "123456",
  "newPassword": "NewPassword@123"
}
```

### 3.7. Lấy danh sách người dùng

```txt
GET /api/auth/users
```

Quyền yêu cầu:

```txt
Admin
```

### 3.8. Cập nhật role người dùng

```txt
PUT /api/auth/users/:userId/role
```

Body:

```json
{
  "newRole": "staff"
}
```

Role hợp lệ:

```txt
admin
staff
customer
```

### 3.9. Xóa người dùng

```txt
DELETE /api/auth/users/:userId
```

Quyền yêu cầu:

```txt
Admin
```

## 4. Products API

Nhóm API dùng để xem, tìm kiếm, thêm, sửa, xóa sản phẩm và upload ảnh sản phẩm.

### 4.1. Lấy danh sách sản phẩm

```txt
GET /api/products
```

Query params hỗ trợ:

```txt
category
brand
search
priceMin
priceMax
sortBy
sortOrder
page
limit
```

Ví dụ:

```txt
GET /api/products?category=laptop&brand=Asus&page=1&limit=20
```

Response:

```json
{
  "message": "Products retrieved",
  "count": 20,
  "products": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 4.2. Lấy chi tiết sản phẩm

```txt
GET /api/products/:id
```

Ví dụ:

```txt
GET /api/products/1
```

### 4.3. Lấy danh sách thương hiệu

```txt
GET /api/products/brands
```

### 4.4. Lấy danh sách danh mục

```txt
GET /api/products/categories
```

### 4.5. Kiểm tra tồn kho

```txt
GET /api/products/stock-check/:id
```

Response:

```json
{
  "message": "Stock check",
  "productId": 1,
  "productName": "Laptop ASUS TUF F16",
  "stock": 10,
  "inStock": true,
  "status": "available"
}
```

### 4.6. Tạo sản phẩm mới

```txt
POST /api/products
```

Quyền yêu cầu:

```txt
Admin
```

Body:

```json
{
  "name": "Laptop ASUS TUF F16",
  "brand": "Asus",
  "category": "gaming-laptop",
  "price": 19990000,
  "originalPrice": 22990000,
  "description": "Laptop gaming hiệu năng cao",
  "image": "/images/products/asus-tuf-f16.png",
  "specs": {
    "cpu": "Intel Core i7",
    "ram": "16GB DDR5",
    "storage": "512GB SSD",
    "gpu": "RTX 4060"
  }
}
```

### 4.7. Cập nhật sản phẩm

```txt
PATCH /api/products/:id
```

Body ví dụ:

```json
{
  "price": 18990000,
  "description": "Đã cập nhật giá khuyến mãi"
}
```

### 4.8. Xóa sản phẩm

```txt
DELETE /api/products/:id
```

### 4.9. Upload ảnh sản phẩm

```txt
POST /api/products/upload-image
```

Content type:

```txt
multipart/form-data
```

Field:

```txt
image
```

## 5. Orders API

Nhóm API dùng để tạo đơn hàng, xem đơn hàng và cập nhật trạng thái đơn hàng.

### 5.1. Tạo đơn hàng

```txt
POST /api/orders/create
```

Yêu cầu:

```txt
Đăng nhập
```

Body:

```json
{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "vana@gmail.com",
  "customerPhone": "0912345678",
  "customerAddress": "Hà Nội",
  "products": [
    {
      "id": 1,
      "name": "Laptop ASUS TUF F16",
      "price": 19990000,
      "quantity": 1
    }
  ],
  "totalPrice": 19990000,
  "notes": "Giao hàng giờ hành chính"
}
```

Response:

```json
{
  "message": "Order created successfully",
  "orderId": 15,
  "order": {
    "id": 15,
    "customerName": "Nguyễn Văn A",
    "customerEmail": "vana@gmail.com",
    "totalPrice": 19990000,
    "totalItems": 1,
    "status": "pending"
  }
}
```

### 5.2. Lấy đơn hàng của người dùng hiện tại

```txt
GET /api/orders/my-orders
```

Query params:

```txt
search
startDate
endDate
status
sortBy
sortOrder
page
limit
```

### 5.3. Lấy chi tiết đơn hàng

```txt
GET /api/orders/:orderId
```

### 5.4. Lấy lịch sử trạng thái đơn hàng

```txt
GET /api/orders/:orderId/status-history
```

### 5.5. Lấy tất cả đơn hàng

```txt
GET /api/orders
```

Quyền yêu cầu:

```txt
Admin
```

### 5.6. Cập nhật trạng thái đơn hàng

```txt
PATCH /api/orders/:orderId/status
```

Quyền yêu cầu:

```txt
Admin
```

Body:

```json
{
  "status": "delivered",
  "notes": "Đơn hàng đã giao thành công"
}
```

Status hợp lệ:

```txt
pending
processing
shipped
delivered
cancelled
```

Lưu ý:

```txt
Khi đơn hàng chuyển sang delivered, hệ thống tự ghi nhận doanh thu vào Transactions API.
```

## 6. Transactions API

Nhóm API dùng để quản lý các khoản thu/chi của hệ thống.

### 6.1. Lấy danh sách thu/chi

```txt
GET /api/transactions
```

Query params:

```txt
type
category
search
startDate
endDate
page
limit
sortBy
sortOrder
```

Ví dụ:

```txt
GET /api/transactions?type=income
```

Response:

```json
{
  "message": "Transactions retrieved",
  "count": 2,
  "transactions": [
    {
      "id": 1,
      "userId": 1,
      "type": "income",
      "title": "Doanh thu đơn hàng #6",
      "amount": 21340000,
      "category": "Doanh thu đơn hàng",
      "description": "Tự động ghi nhận khi đơn hàng #6 đã giao",
      "transactionDate": "2026-05-03",
      "source": "order",
      "orderId": 6
    }
  ],
  "summary": {
    "totalIncome": 21340000,
    "totalExpense": 2500000,
    "balance": 18840000
  }
}
```

### 6.2. Lấy chi tiết một khoản thu/chi

```txt
GET /api/transactions/:id
```

### 6.3. Tạo khoản thu/chi thủ công

```txt
POST /api/transactions
```

Body khoản thu:

```json
{
  "type": "income",
  "title": "Thu bán linh kiện",
  "amount": 1500000,
  "category": "Bán hàng",
  "description": "Khách mua RAM",
  "transactionDate": "2026-05-03"
}
```

Body khoản chi:

```json
{
  "type": "expense",
  "title": "Chi nhập hàng",
  "amount": 2500000,
  "category": "Nhập hàng",
  "description": "Nhập thêm SSD",
  "transactionDate": "2026-05-03"
}
```

### 6.4. Cập nhật khoản thu/chi

```txt
PATCH /api/transactions/:id
```

Body:

```json
{
  "amount": 1800000,
  "description": "Đã cập nhật số tiền"
}
```

### 6.5. Xóa khoản thu/chi

```txt
DELETE /api/transactions/:id
```

Lưu ý:

```txt
Khoản thu có source = order là doanh thu tự động từ đơn hàng đã giao.
Các khoản này không được sửa/xóa thủ công.
```

### 6.6. Doanh thu tự động từ đơn đã giao

Quy tắc tự động:

- Chỉ đơn hàng có status `delivered` mới được tính vào thu.
- Khi đơn hàng chuyển sang `delivered`, hệ thống tự tạo khoản thu.
- Tiêu đề khoản thu có dạng `Doanh thu đơn hàng #ID`.
- Nguồn dữ liệu là `source = order`.
- Nếu đơn hàng không còn trạng thái `delivered`, khoản thu tự động sẽ bị loại khỏi danh sách thu/chi.
- Hệ thống không cộng trùng doanh thu khi gọi API nhiều lần.

## 7. Reports API

Nhóm API dùng để lấy dữ liệu thống kê dashboard, doanh thu, đơn hàng và export báo cáo.

### 7.1. Dashboard statistics

```txt
GET /api/reports/dashboard
```

Query params:

```txt
period=week|month|year
```

### 7.2. Revenue trends

```txt
GET /api/reports/revenue
```

Query params:

```txt
days
```

Ví dụ:

```txt
GET /api/reports/revenue?days=30
```

### 7.3. Order statistics

```txt
GET /api/reports/orders
```

### 7.4. Export orders Excel

```txt
GET /api/reports/export/orders/excel
```

### 7.5. Export products Excel

```txt
GET /api/reports/export/products/excel
```

### 7.6. Export orders PDF

```txt
GET /api/reports/export/orders/pdf
```

## 8. Mã lỗi thường gặp

### 400 Bad Request

Dữ liệu gửi lên thiếu hoặc sai định dạng.

Ví dụ:

```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized

Chưa đăng nhập hoặc token không hợp lệ.

```json
{
  "message": "No token provided"
}
```

### 403 Forbidden

Không có quyền truy cập tài nguyên.

```json
{
  "message": "Admin access required"
}
```

### 404 Not Found

Không tìm thấy dữ liệu.

```json
{
  "message": "Product not found"
}
```

### 422 Unprocessable Entity

Dữ liệu hợp lệ về cú pháp nhưng không hợp lệ về nghiệp vụ.

Ví dụ:

```json
{
  "message": "Amount must be greater than 0"
}
```

### 500 Internal Server Error

Lỗi server.

```json
{
  "message": "Server error"
}
```

## 9. Kịch bản test nhanh bằng Postman

### Bước 1: Login admin

```txt
POST http://localhost:5000/api/auth/login
```

Body:

```json
{
  "email": "admin@computerstore.com",
  "password": "Admin@123"
}
```

### Bước 2: Lấy danh sách sản phẩm

```txt
GET http://localhost:5000/api/products
```

### Bước 3: Tạo đơn hàng

```txt
POST http://localhost:5000/api/orders/create
```

Body:

```json
{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "vana@gmail.com",
  "customerPhone": "0912345678",
  "customerAddress": "Hà Nội",
  "products": [
    {
      "id": 1,
      "name": "Laptop ASUS TUF F16",
      "price": 19990000,
      "quantity": 1
    }
  ],
  "totalPrice": 19990000
}
```

### Bước 4: Cập nhật đơn sang đã giao

```txt
PATCH http://localhost:5000/api/orders/:orderId/status
```

Body:

```json
{
  "status": "delivered",
  "notes": "Đơn hàng đã giao thành công"
}
```

### Bước 5: Kiểm tra doanh thu trong Thu/Chi

```txt
GET http://localhost:5000/api/transactions?type=income
```

Kết quả mong đợi:

```txt
Xuất hiện khoản thu Doanh thu đơn hàng #ID
```

## 10. Tài khoản test

### Admin

```txt
Email: admin@computerstore.com
Password: Admin@123
```

### Staff

```txt
Email: staff@computerstore.com
Password: Staff@123
```

## 11. Ghi chú dành cho lập trình viên

- Backend dùng SQLite nên dữ liệu được lưu trong file database local.
- API trả dữ liệu dạng JSON.
- Các API quản trị yêu cầu JWT token của tài khoản admin.
- Transactions API có hai loại dữ liệu:
  - `source = manual`: Thu/chi nhập thủ công
  - `source = order`: Doanh thu tự động từ đơn hàng đã giao
- Không nên chỉnh sửa trực tiếp khoản thu có `source = order`.
- Nếu thêm route mới, cần mount route trong `backend/server.js`.
- Nếu thêm bảng mới, cần cập nhật `backend/config/db.js` hoặc tạo migration trong `backend/migrations`.
