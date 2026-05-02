# 📦 Database Backup & Restore Workflow

## Vấn Đề Được Giải Quyết

Khi push code lên GitHub, dữ liệu sản phẩm được thêm bằng admin dashboard sẽ **bị mất** vì:
- Database file (`computerstore.db`) bị ignore trong `.gitignore`
- Ảnh sản phẩm lưu local cũng bị ignore

**Giải pháp**: Tự động backup dữ liệu vào file `backup.json` và restore khi khởi động.

---

## 🔄 Workflow Hoạt Động

### 1️⃣ **Admin Thêm Sản Phẩm** (Bạn)

```
Admin Dashboard → Thêm sản phẩm → Lưu vào Database
```

### 2️⃣ **Backup Dữ Liệu**

```bash
# Terminal tại thư mục backend
npm run backup

# Tạo file backup.json chứa tất cả sản phẩm, users, orders
# ✅ backup.json được tạo tại: backend/backup.json
```

### 3️⃣ **Commit & Push Lên GitHub**

```bash
# Thêm backup vào git
git add backup.json
git commit -m "chore: backup product data"
git push origin main
```

### 4️⃣ **Người Khác Tải & Chạy** (Đồng Nghiệp)

```bash
git clone <your-repo>
cd computer-store-project-master

# Chạy toàn bộ dự án
docker-compose up -d --build

# Hoặc chạy riêng backend:
cd backend
npm install
npm run migrate
npm start

# ✅ Tự động:
# 1. Tạo database
# 2. Tạo bảng users, products, orders
# 3. Tạo tài khoản admin/staff/customer
# 4. Restore dữ liệu từ backup.json
```

---

## 📊 Cấu Trúc File `backup.json`

```json
{
  "exportDate": "2026-05-02T10:30:00.000Z",
  "products": [
    {
      "id": 1,
      "name": "Asus VivoBook Pro 16 2026",
      "brand": "Asus",
      "category": "laptop",
      "price": 28000000,
      "originalPrice": 32000000,
      "description": "...",
      "specs": "{...}",
      "image": "...",
      "createdAt": "2026-05-02T10:00:00.000Z"
    }
    // ... thêm sản phẩm khác
  ],
  "users": [...],
  "orders": [...]
}
```

---

## ⚠️ Lưu Ý Về Ảnh Sản Phẩm

### ❌ Vấn Đề Hiện Tại
- Ảnh lưu trong `backend/uploads/products/` (local)
- Folder `uploads/` được ignore bởi `.gitignore`
- **Kết quả**: Ảnh không được push lên GitHub

### ✅ 3 Giải Pháp

#### **Phương án 1: Upload Ảnh Lên Cloud (Tốt Nhất)**

Sử dụng Cloudinary hoặc AWS S3:
```javascript
// backend/controllers/productsController.js
const uploadProductImage = async (req, res) => {
  // Thay vì lưu local, upload lên Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path);
  const imageUrl = result.secure_url; // URL cloud
};
```

**Ưu điểm**:
- ✅ Ảnh luôn có sẵn trên toàn bộ máy
- ✅ Không cần backup ảnh
- ✅ Tiết kiệm storage local

**Chi phí**: Cloudinary free tier = 25GB/tháng (đủ dùng)

---

#### **Phương án 2: Lưu URL Ảnh Thay Vì Upload Local**

Trong modal thêm sản phẩm, sử dụng URL ảnh từ internet:
```
Thay vì chọn ảnh từ máy
↓
Nhập URL ảnh từ internet (Pinterest, Unsplash, v.v.)
```

**Ưu điểm**: 
- ✅ Đơn giản, không cần setup cloud
- ✅ Dữ liệu tự động được lưu trong backup.json

---

#### **Phương án 3: Base64 Encode Ảnh (Tạm Thời)**

Lưu ảnh dạng base64 trong database:
```javascript
// Convert ảnh thành base64 và lưu trực tiếp
const imageBase64 = fs.readFileSync(imagePath, 'base64');
specs.imageData = imageBase64;
```

**Hạn chế**: 
- File database sẽ rất lớn
- Chậm khi load

---

## 🚀 Recommended Workflow (Đơn Giản Nhất)

### Step 1: Admin Thêm Sản Phẩm Với URL Ảnh

Trong admin dashboard, khi thêm sản phẩm:
- **Tên sản phẩm**: "Asus VivoBook Pro 16"
- **Brand**: "Asus"
- **Ảnh bìa**: Paste URL ảnh từ internet (ví dụ từ Google Images)
  ```
  https://images.unsplash.com/photo-xxx...
  ```

### Step 2: Backup & Commit

```bash
cd backend
npm run backup
git add backup.json
git commit -m "feat: add products with URLs"
git push
```

### Step 3: Người Khác Clone & Chạy

```bash
git clone <repo>
docker-compose up -d --build

# ✅ Mọi sản phẩm, ảnh (URL), dữ liệu đều restore
```

---

## 📋 Quy Trình Chi Tiết Cho Người Sử Dụng

### Cho Admin (Bạn):

```bash
# 1. Thêm sản phẩm từ dashboard (http://localhost:3000/admin/products)
# 2. Chỉnh sửa sản phẩm nếu cần

# 3. Backup dữ liệu
npm run backup

# 4. Check file backup.json đã tạo
ls -la backup.json

# 5. Commit & Push
git add backup.json
git commit -m "chore: backup database with new products"
git push origin main
```

### Cho Developer (Người Khác):

```bash
# 1. Clone repo
git clone https://github.com/yourname/computer-store.git

# 2. Chạy dự án (Docker hoặc Node)
docker-compose up -d --build

# 3. Truy cập
# Frontend: http://localhost:3000
# API: http://localhost:5000
# ✅ Tất cả sản phẩm & dữ liệu đã có sẵn!
```

---

## 🔍 Kiểm Tra Backup/Restore

```bash
# Xem nội dung backup
cat backup.json

# Kiểm tra số sản phẩm được restore
npm run backup && cat backup.json | grep -o '"id"' | wc -l
```

---

## 🎯 Tóm Tắt

| Vấn Đề | Giải Pháp |
|--------|---------|
| Database bị mất | ✅ `backup.json` + auto-restore |
| Ảnh bị mất | ✅ Dùng URL cloud hoặc Cloudinary |
| Dữ liệu không sync | ✅ Commit backup.json lên Git |
| Người khác clone bị mất dữ liệu | ✅ Tự động restore khi chạy |

---

## ❓ Câu Hỏi Thường Gặp

**Q: Có cần backup mỗi lần thêm sản phẩm?**
A: Có, best practice là backup sau mỗi lần thêm sản phẩm quan trọng, hoặc có thể tự động backup khi nhân viên đăng xuất.

**Q: Nếu quên backup thì sao?**
A: Dữ liệu chỉ có trong database local. Khi push lên GitHub, dữ liệu sẽ bị mất khi người khác clone.

**Q: Có thể auto-backup?**
A: Có, có thể thêm hook trong admin dashboard để tự động backup sau mỗi thay đổi.

**Q: Ảnh bao giờ xóa được?**
A: Ảnh local trong `uploads/` sẽ bị xóa khi rebuild Docker. Dùng cloud storage để bảo toàn.

---

## 📞 Hỗ Trợ

Nếu gặp lỗi restore:
```bash
# Xem log khôi phục
docker logs computer-store-backend

# Kiểm tra backup.json hợp lệ
node -e "JSON.parse(require('fs').readFileSync('backup.json'))"
```
