# Hướng dẫn sử dụng hệ thống Computer Store

## 1. Giới thiệu

Computer Store là website bán máy tính/laptop gồm frontend ReactJS và backend ExpressJS. Hệ thống hỗ trợ người dùng xem sản phẩm, thêm vào giỏ hàng, đặt hàng, theo dõi đơn hàng. Phía quản trị viên có thể quản lý sản phẩm, đơn hàng, người dùng, báo cáo và quản lý thu/chi.

## 2. Công nghệ sử dụng

- Frontend: ReactJS, Ant Design, React Router
- Backend: Node.js, ExpressJS
- Database: SQLite
- Authentication: JWT
- API Docs: Swagger
- Deploy/dev environment: Docker Compose

## 3. Cấu trúc thư mục chính

```txt
computer-store-project-master/
  backend/
    config/
    controllers/
    middleware/
    migrations/
    routes/
    services/
    server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
      services/
      styles/
  docker-compose.yml
```

## 4. Cài đặt và chạy project

### 4.1. Chạy backend

Mở terminal tại thư mục backend:

```bash
cd backend
npm install
npm start
```

Backend chạy tại:

```txt
http://localhost:5000
```

Kiểm tra server:

```txt
http://localhost:5000/health
```

Swagger API Docs:

```txt
http://localhost:5000/api-docs
```

### 4.2. Chạy frontend

Mở terminal tại thư mục frontend:

```bash
cd frontend
npm install
npm start
```

Frontend chạy tại:

```txt
http://localhost:3000
```

### 4.3. Chạy bằng Docker Compose

Tại thư mục gốc của project:

```bash
docker compose up --build -d
```

Các service chính:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api-docs`

## 5. Tài khoản mặc định

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

## 6. Chức năng người dùng

### 6.1. Xem danh sách sản phẩm

Người dùng có thể xem danh sách sản phẩm laptop/máy tính theo danh mục, thương hiệu và giá.

Trang sản phẩm:

```txt
http://localhost:3000/products
```

### 6.2. Xem chi tiết sản phẩm

Người dùng bấm vào sản phẩm để xem:

- Tên sản phẩm
- Giá bán
- Hình ảnh
- Cấu hình
- Mô tả
- Tồn kho

### 6.3. Giỏ hàng

Người dùng có thể:

- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Xem tổng tiền

### 6.4. Đặt hàng

Luồng đặt hàng:

1. Đăng nhập tài khoản
2. Thêm sản phẩm vào giỏ
3. Vào trang thanh toán
4. Nhập thông tin nhận hàng
5. Xác nhận đặt hàng
6. Hệ thống tạo đơn hàng với trạng thái ban đầu là `pending`

### 6.5. Theo dõi đơn hàng

Người dùng có thể xem danh sách đơn hàng của mình tại:

```txt
http://localhost:3000/my-orders
```

Các trạng thái đơn hàng:

- `pending`: Chờ xử lý
- `processing`: Đang xử lý
- `shipped`: Đã gửi
- `delivered`: Đã giao
- `cancelled`: Đã hủy

## 7. Chức năng Admin Dashboard

Admin Dashboard:

```txt
http://localhost:3000/admin
```

Các module chính:

- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý khách hàng/người dùng
- Quản lý thu/chi
- Dashboard thống kê

## 8. Quản lý sản phẩm

Đường dẫn:

```txt
http://localhost:3000/admin/products
```

Admin có thể:

- Xem danh sách sản phẩm
- Thêm sản phẩm mới
- Sửa thông tin sản phẩm
- Xóa sản phẩm
- Upload ảnh sản phẩm
- Xuất danh sách sản phẩm ra Excel

Thông tin sản phẩm gồm:

- Tên sản phẩm
- Thương hiệu
- Danh mục
- Giá bán
- Giá gốc
- Ảnh bìa
- Ảnh chi tiết
- Mô tả
- Cấu hình CPU, GPU, RAM, ổ cứng, nguồn, mainboard

## 9. Quản lý đơn hàng

Đường dẫn:

```txt
http://localhost:3000/admin/orders
```

Admin có thể:

- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem lịch sử thay đổi trạng thái

Khi admin đổi trạng thái đơn hàng, hệ thống lưu lại lịch sử gồm:

- Trạng thái cũ
- Trạng thái mới
- Người thay đổi
- Thời gian thay đổi
- Ghi chú nếu có

## 10. Quản lý thu/chi

Đường dẫn:

```txt
http://localhost:3000/admin/transactions
```

Module Thu/Chi dùng để quản lý dòng tiền trong hệ thống.

### 10.1. Các chỉ số hiển thị

Trang Thu/Chi hiển thị:

- Tổng thu
- Tổng chi
- Số dư
- Danh sách khoản thu/chi

### 10.2. Thêm khoản thu/chi thủ công

Admin bấm nút `Thêm khoản thu/chi`, sau đó nhập:

- Loại: Khoản thu hoặc Khoản chi
- Ngày ghi nhận
- Tiêu đề
- Số tiền
- Danh mục
- Ghi chú

Ví dụ khoản thu:

```txt
Loại: Khoản thu
Tiêu đề: Thu bán linh kiện
Số tiền: 1500000
Danh mục: Bán hàng
Ghi chú: Khách mua RAM
```

Ví dụ khoản chi:

```txt
Loại: Khoản chi
Tiêu đề: Chi nhập hàng
Số tiền: 2500000
Danh mục: Nhập hàng
Ghi chú: Nhập thêm SSD
```

### 10.3. Doanh thu tự động từ đơn hàng đã giao

Hệ thống đã tích hợp tự động doanh thu từ đơn hàng vào Thu/Chi.

Quy tắc:

- Chỉ những đơn hàng có trạng thái `delivered` mới được tính là doanh thu.
- Khi đơn hàng chuyển sang `delivered`, hệ thống tự tạo một khoản thu.
- Khoản thu tự động có tiêu đề dạng `Doanh thu đơn hàng #ID`.
- Khoản thu tự động có nguồn là `Đơn hàng #ID`.
- Khoản thu này không bị cộng trùng nếu mở dashboard nhiều lần.
- Nếu đơn hàng không còn trạng thái `delivered`, khoản thu tự động sẽ bị loại khỏi Thu/Chi.
- Khoản thu tự động từ đơn hàng sẽ bị khóa sửa/xóa trên giao diện để tránh thay đổi nhầm dữ liệu hệ thống.

Ví dụ:

```txt
Đơn hàng #6 có tổng tiền 21.340.000 VND
Khi chuyển trạng thái sang Đã giao
Hệ thống tự thêm khoản thu:
Doanh thu đơn hàng #6 - 21.340.000 VND
```

### 10.4. Lọc khoản thu/chi

Admin có thể lọc:

- Tất cả
- Khoản thu
- Khoản chi

## 11. API chính của hệ thống

### 11.1. Authentication API

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/verify
POST /api/auth/forgot-password
POST /api/auth/verify-reset-code
POST /api/auth/reset-password
GET  /api/auth/users
PUT  /api/auth/users/:userId/role
DELETE /api/auth/users/:userId
```

### 11.2. Products API

```txt
GET    /api/products
GET    /api/products/:id
GET    /api/products/brands
GET    /api/products/categories
GET    /api/products/stock-check/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/upload-image
```

### 11.3. Orders API

```txt
POST  /api/orders/create
GET   /api/orders/my-orders
GET   /api/orders/:orderId
GET   /api/orders/:orderId/status-history
GET   /api/orders
PATCH /api/orders/:orderId/status
```

### 11.4. Transactions API

```txt
GET    /api/transactions
GET    /api/transactions/:id
POST   /api/transactions
PATCH  /api/transactions/:id
DELETE /api/transactions/:id
```

### 11.5. Reports API

```txt
GET /api/reports/dashboard
GET /api/reports/revenue
GET /api/reports/orders
GET /api/reports/export/orders/excel
GET /api/reports/export/products/excel
GET /api/reports/export/orders/pdf
```

## 12. Kiểm thử API Thu/Chi bằng Postman

### 12.1. Login lấy token

Request:

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

Copy `token` trong response.

Các request tiếp theo thêm header:

```txt
Authorization: Bearer <token>
Content-Type: application/json
```

### 12.2. Tạo khoản thu

Request:

```txt
POST http://localhost:5000/api/transactions
```

Body:

```json
{
  "type": "income",
  "title": "Thu bán laptop",
  "amount": 19990000,
  "category": "Bán hàng",
  "description": "Khách mua laptop ASUS",
  "transactionDate": "2026-05-03"
}
```

### 12.3. Tạo khoản chi

Request:

```txt
POST http://localhost:5000/api/transactions
```

Body:

```json
{
  "type": "expense",
  "title": "Chi nhập hàng",
  "amount": 5000000,
  "category": "Nhập hàng",
  "description": "Nhập thêm linh kiện",
  "transactionDate": "2026-05-03"
}
```

### 12.4. Lấy danh sách thu/chi

Request:

```txt
GET http://localhost:5000/api/transactions
```

Lọc khoản thu:

```txt
GET http://localhost:5000/api/transactions?type=income
```

Lọc khoản chi:

```txt
GET http://localhost:5000/api/transactions?type=expense
```

### 12.5. Cập nhật khoản thu/chi

Request:

```txt
PATCH http://localhost:5000/api/transactions/1
```

Body:

```json
{
  "amount": 18990000,
  "description": "Đã cập nhật số tiền"
}
```

### 12.6. Xóa khoản thu/chi

Request:

```txt
DELETE http://localhost:5000/api/transactions/1
```

Lưu ý: khoản thu tự động từ đơn hàng đã giao không được sửa/xóa thủ công.

## 13. Kiểm thử doanh thu tự động từ đơn hàng đã giao

### Bước 1: Login admin

Login bằng:

```txt
admin@computerstore.com
Admin@123
```

### Bước 2: Vào trang quản lý đơn hàng

```txt
http://localhost:3000/admin/orders
```

### Bước 3: Đổi trạng thái đơn hàng

Chọn một đơn hàng và đổi trạng thái sang:

```txt
Đã giao
```

Tương ứng backend status:

```txt
delivered
```

### Bước 4: Kiểm tra Thu/Chi

Vào:

```txt
http://localhost:3000/admin/transactions
```

Kết quả mong đợi:

- Có khoản thu mới tên `Doanh thu đơn hàng #ID`
- Số tiền bằng tổng tiền đơn hàng
- Nguồn hiển thị là `Đơn hàng #ID`
- Tổng thu và số dư được cập nhật

## 14. Backup và restore dữ liệu

Backend có các file hỗ trợ backup/restore:

```txt
backend/config/backup.js
backend/config/restore.js
backend/backup.json
```

Chạy backup:

```bash
cd backend
npm run backup
```

Khi backend khởi động, hệ thống có thể kiểm tra và khôi phục dữ liệu từ `backup.json` nếu có.

## 15. Gợi ý demo thuyết trình

Kịch bản demo nhanh:

1. Mở trang chủ và xem danh sách sản phẩm.
2. Đăng nhập bằng tài khoản admin.
3. Vào Admin Dashboard.
4. Thêm hoặc sửa một sản phẩm.
5. Vào quản lý đơn hàng và đổi một đơn sang trạng thái `Đã giao`.
6. Vào Thu/Chi để chứng minh doanh thu đơn hàng đã giao được tự động ghi nhận.
7. Thêm một khoản chi thủ công như `Chi nhập hàng`.
8. Quan sát `Tổng thu`, `Tổng chi`, `Số dư`.
9. Mở Swagger hoặc Postman để demo API nếu cần.

## 16. Lưu ý

- Thu/Chi thủ công có thể sửa/xóa.
- Thu tự động từ đơn hàng đã giao không nên sửa/xóa trực tiếp.
- Chỉ đơn hàng `Đã giao` mới được tính vào doanh thu Thu/Chi.
- Nếu backend đang chạy bản cũ, cần restart backend để nhận route/API mới.
- Nếu frontend không thấy giao diện mới, cần restart `npm start` hoặc refresh trình duyệt.
