## 🧪 TEST ROLE SYSTEM API

### 1️⃣ ĐĂNG KÝ USER CUSTOMER

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@mail.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

**Response:**
```json
{
  "message": "Register successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@mail.com",
    "role": "customer",
    "isAdmin": false
  }
}
```

**⚠️ Lưu ý:** `role` được set mặc định là `"customer"`

---

### 2️⃣ ĐĂNG NHẬP ADMIN

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@computerstore.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@computerstore.com",
    "role": "admin",
    "isAdmin": 1
  }
}
```

**Lưu token này để dùng cho bước tiếp theo** ➡️ `ADMIN_TOKEN`

---

### 3️⃣ VIEW TẤT CẢ USERS (ADMIN ONLY)

```bash
# Thay ADMIN_TOKEN bằng token từ bước 2
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

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
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@mail.com",
      "role": "customer",
      "isAdmin": 0,
      "createdAt": "2024-02-20T15:45:30.000Z"
    }
  ]
}
```

---

### 4️⃣ ĐỔI ROLE USER THÀNH "STAFF"

**Chuyển user id=3 từ "customer" → "staff":**

```bash
# Thay ADMIN_TOKEN bằng token admin
curl -X PUT http://localhost:5000/api/auth/users/3/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "staff"
  }'
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

**Verify:** Gọi lại bước 3 để xem role đã đổi

---

### 5️⃣ ĐỔI ROLE USER THÀNH "ADMIN"

```bash
curl -X PUT http://localhost:5000/api/auth/users/3/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "admin"
  }'
```

**Response:**
```json
{
  "message": "User role updated to admin",
  "userId": 3,
  "newRole": "admin",
  "isAdmin": 1
}
```

---

### ❌ LỖI: USER KHÔNG PHẢI ADMIN

**Nếu token không phải admin, sẽ lỗi:**

```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

**Response:**
```json
{
  "message": "Admin access required"
}
```

---

### ❌ LỖI: ROLE KHÔNG HỢP LỆ

```bash
curl -X PUT http://localhost:5000/api/auth/users/3/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newRole": "superadmin"
  }'
```

**Response:**
```json
{
  "message": "Invalid role. Must be: customer, staff, admin"
}
```

---

## 📋 POSTMAN COLLECTION SETUP

### 1. Tạo Environment Variables

**Environment: ComputerStore**
```
{
  "base_url": "http://localhost:5000",
  "admin_token": "",
  "customer_token": "",
  "admin_id": "1",
  "customer_id": "3"
}
```

### 2. Request 1: Login Admin

```
POST {{base_url}}/api/auth/login
Body (json):
{
  "email": "admin@computerstore.com",
  "password": "Admin@123"
}

Tests (Script):
var jsonData = pm.response.json();
pm.environment.set("admin_token", jsonData.token);
```

### 3. Request 2: Get All Users

```
GET {{base_url}}/api/auth/users
Headers:
Authorization: Bearer {{admin_token}}
```

### 4. Request 3: Update User Role

```
PUT {{base_url}}/api/auth/users/3/role
Headers:
Authorization: Bearer {{admin_token}}
Content-Type: application/json

Body (json):
{
  "newRole": "staff"
}
```

### 5. Request 4: Register New Customer

```
POST {{base_url}}/api/auth/register
Body (json):
{
  "name": "Khách hàng mới",
  "email": "newcustomer@mail.com",
  "password": "123456",
  "confirmPassword": "123456"
}

Tests (Script):
var jsonData = pm.response.json();
pm.environment.set("customer_token", jsonData.token);
pm.test("Role should be customer", function() {
  pm.expect(jsonData.user.role).to.equal("customer");
});
```

---

## 🎯 QUICK TEST CHECKLIST

- [ ] Backend chạy: `npm start`
- [ ] Migration chạy thành công: `npm run migrate`
- [ ] Đăng ký được + role = "customer"
- [ ] Đăng nhập admin OK + nhận token
- [ ] Admin xem được danh sách users
- [ ] Admin đổi role user được
- [ ] Customer không xem được user list (lỗi 403)
- [ ] Token hết hạn → 401 error
