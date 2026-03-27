# 📚 API Documentation với Swagger

## ✅ Tệp đã tạo
- `backend/swagger.js` - Swagger configuration
- `backend/swagger-endpoints.js` - API endpoints documentation
- Updated `backend/package.json` - Thêm swagger packages
- Updated `backend/server.js` - Integrated Swagger UI

---

## 🚀 Hướng dẫn sử dụng

### **1. Cài đặt Dependencies**

```bash
cd backend
npm install
```

Điều này sẽ cài đặt:
- `swagger-ui-express` - Giao diện Swagger
- `swagger-jsdoc` - Parse JSDoc comments thành Swagger spec

### **2. Chạy Backend**

```bash
npm run dev
```

Bạn sẽ thấy output:
```
📚 API Docs: http://localhost:5000/api-docs
```

### **3. Truy cập Swagger UI**

Mở trình duyệt đến: **http://localhost:5000/api-docs**

---

## 📋 API Endpoints Đã Documented

### **🔐 Authentication**
- `POST /api/auth/register` - Đăng ký người dùng
- `POST /api/auth/login` - Đăng nhập

### **📦 Products**
- `GET /api/products` - Lấy danh sách sản phẩm (có filter, sort, pagination)
- `GET /api/products/{id}` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin only)

### **🛒 Orders**
- `GET /api/orders` - Lấy danh sách orders
- `GET /api/orders/{id}` - Lấy chi tiết order
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/{id}` - Cập nhật trạng thái order (Admin only)

---

## ✨ Tính năng Swagger

✅ **Interactive API Testing**
- Thử call API trực tiếp từ Swagger UI
- Tự động generate request/response examples

✅ **Clear Documentation**
- Mô tả chi tiết cho mỗi endpoint
- Parameter definitions
- Request/Response schemas
- HTTP status codes

✅ **Security Schemes**
- Bearer Token authentication support
- Show required headers

✅ **JSON Schema Validation**
- Auto-generated từ JSDoc comments
- Dễ hiểu và maintain

---

## 🔧 Custom Swagger Configuration

File `swagger.js` chứa:
- API info (title, version, contact)
- Servers (localhost, docker)
- Security schemes (JWT Bearer)
- Reusable schemas (Product, Order, User, Error)

---

## 📖 Swagger JSDoc Format

Tất cả API endpoints dùng JSDoc comments:

```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters: [...]
 *     responses:
 *       200:
 *         description: Success
 */
```

---

## 🌐 Export API Documentation

### **Option 1: Swagger JSON**
```
GET http://localhost:5000/api-docs/swagger.json
```

Dùng để import vào Postman hoặc tools khác.

### **Option 2: Postman Import**
1. Copy URL: `http://localhost:5000/api-docs/swagger.json`
2. Vào Postman → Import → Paste URL
3. Bam! Tất cả API endpoints đã được import

---

## 🐳 Docker + Swagger

Khi chạy với docker-compose:
```bash
docker-compose up -d --build
```

Swagger vẫn accessible ở:
```
http://localhost:5000/api-docs
```

(Docker network sẽ tự map port)

---

## 📝 Thêm API Endpoints

Để document thêm endpoint, thêm JSDoc comment ở `swagger-endpoints.js`:

```javascript
/**
 * @swagger
 * /api/newendpoint:
 *   get:
 *     summary: Description
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Success
 */
```

Swagger sẽ tự động reload (hoặc restart server).

---

## ✨ Tiêu chí đạt ✅
- ✅ Show trang Swagger UI hoặc link Postman Documentation
- ✅ Input/Output của các API được mô tả rõ ràng
- ✅ Hỗ trợ Bearer Token authentication
