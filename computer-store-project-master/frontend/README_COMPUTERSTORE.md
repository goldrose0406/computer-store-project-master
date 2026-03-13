# 💻 ComputerStore - Ứng dụng bán máy tính và laptop

## 📋 Mô tả

Đây là một ứng dụng web bán máy tính và laptop được xây dựng bằng **React** và **Ant Design**. Ứng dụng bao gồm:

✅ **Trang chủ (HomePage)** - Banner, thống kê, danh sách sản phẩm nổi bật  
✅ **Danh sách sản phẩm (ProductList)** - Lọc, sắp xếp, phân trang  
✅ **Chi tiết sản phẩm (ProductDetail)** - Xem thông số, thêm vào giỏ, sản phẩm liên quan  
✅ **Admin Dashboard** - Quản lý đơn hàng, sản phẩm, khách hàng, thống kê  
✅ **Navigation** - Navbar, Sidebar, Routing mượt mà không reload  

---

## 🎯 Tính năng

### 👥 Người dùng thường
- 🏠 Trang chủ với carousel banner
- 🔍 Tìm kiếm và lọc sản phẩm theo thương hiệu
- 📊 Sắp xếp sản phẩm (giá, đánh giá, mới nhất)
- ⭐ Xem chi tiết sản phẩm với thông số kỹ thuật
- ❤️ Yêu thích sản phẩm
- 🛒 Thêm vào giỏ hàng

### 👨‍💼 Admin
- 📋 Quản lý đơn hàng (xem, xóa)
- 🛍️ Quản lý sản phẩm (thêm, sửa, xóa)
- 👥 Quản lý khách hàng
- 📈 Xem thống kê doanh thu

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **UI Library**: Ant Design 5.12.7
- **Routing**: React Router v6.22.0
- **Styling**: CSS3 + Responsive Design
- **State Management**: React Hooks

---

## 📂 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.js           # Trang chủ
│   │   ├── ProductListPage.js    # Danh sách sản phẩm
│   │   ├── ProductDetailPage.js  # Chi tiết sản phẩm
│   │   └── AdminDashboard.js     # Admin dashboard
│   ├── components/
│   │   ├── Navbar.js             # Thanh điều hướng
│   │   ├── Sidebar.js            # Thanh bên cho admin
│   │   └── ProductCard.js        # Thẻ sản phẩm
│   ├── data/
│   │   └── mockData.js           # Dữ liệu giả lập
│   ├── styles/
│   │   ├── HomePage.css
│   │   ├── Navbar.css
│   │   ├── ProductCard.css
│   │   ├── ProductList.css
│   │   ├── ProductDetail.css
│   │   └── AdminDashboard.css
│   ├── App.js                    # Routing chính
│   ├── App.css
│   └── index.js
├── public/
│   ├── index.html
│   └── images/
│       └── sanpham/              # Hình ảnh sản phẩm
├── package.json
└── README.md
```

---

## 🚀 Cài đặt và Chạy

### 1. Cài đặt Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Chạy Development Server
```bash
npm start
```
Ứng dụng sẽ mở tại `http://localhost:3000`

### 3. Build Production
```bash
npm run build
```

---

## 🗺️ Routing Map

| Url | Tên trang | Mô tả |
|-----|-----------|-------|
| `/` | Trang chủ | Hiển thị banner, stats, brands, sản phẩm nổi bật |
| `/products` | Danh sách sản phẩm | Lọc, sắp xếp, phân trang |
| `/product/:id` | Chi tiết sản phẩm | Xem thông số, thêm giỏ, sản phẩm liên quan |
| `/admin` | Admin Dashboard | Quản lý đơn hàng, sản phẩm, khách hàng |

---

## 💾 Mock Data

Dữ liệu được lưu trong `src/data/mockData.js`:
- ✏️ 6 sản phẩm mẫu từ các thương hiệu: MacBook, Asus, Lenovo, Acer, MSI
- 📦 3 đơn hàng mẫu
- 🏷️ 5 thương hiệu
- 4️⃣ 4 danh mục

---

## 📱 Responsive Design

✅ **Desktop** (1200px+) - Layout tối ưu cho máy tính  
✅ **Tablet** (768px - 1199px) - Layout điều chỉnh  
✅ **Mobile** (< 768px) - Layout stack, touch-friendly  

### Breakpoints:
- `@media (max-width: 1200px)` - Màn hình lớn
- `@media (max-width: 992px)` - Tablet ngang
- `@media (max-width: 768px)` - Tablet dọc
- `@media (max-width: 576px)` - Điện thoại

---

## ⚡ Hiệu suất & UX

✅ **SPA Routing** - Chuyển trang không reload  
✅ **Smooth Animations** - Hover effects, transitions  
✅ **Lazy Loading** - Hình ảnh tối ưu  
✅ **Loading States** - Spinner khi chờ đợi  
✅ **Error Handling** - Empty states, 404 redirect  

---

## 🎨 Components

### ProductCard
- Hiển thị hình ảnh sản phẩm
- Thể hiện giá, giảm giá, đánh giá
- Nút "Thêm giỏ", "Yêu thích"
- Hover animation

### Navbar
- Logo branding
- Menu điều hướng
- Search bar
- Shopping cart badge
- User dropdown menu

### Sidebar (Admin)
- Menu admin
- Navigation links
- Điều chỉnh collapsed state

---

## 🔄 State Management

Dự án hiện sử dụng **React Hooks** cho state local:
- `useState` - Quản lý state
- `useNavigate` - Điều hướng
- `useParams` - Lấy parameters từ URL
- `useLocation` - Lấy location state

---

## 🚀 Tính năng trong tương lai

- [ ] Backend API integration
- [ ] Thêm Search toàn cục
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Payment integration
- [ ] Reviews & Ratings
- [ ] Wishlist save
- [ ] Order tracking

---

## 📞 Liên hệ

**Email**: support@computerstore.com  
**Hotline**: 1900-xxxx-xxx  
**Địa chỉ**: 123 Đường ABC, TP.HCM

---

## 📄 License

2024 © ComputerStore. All rights reserved.
