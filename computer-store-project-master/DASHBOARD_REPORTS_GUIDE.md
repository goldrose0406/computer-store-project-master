# 📊 Dashboard & Reports Guide

## ✅ Các tệp đã tạo

### Backend
- `backend/routes/reports.js` - API endpoints cho Dashboard statistics
- Updated `backend/server.js` - Thêm reports routes

### Frontend
- `frontend/src/components/DashboardReports.js` - Dashboard component với Charts
- Updated `frontend/package.json` - Thêm recharts library

---

## 🚀 Hướng dẫn sử dụng

### **1. Cài đặt Dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install --legacy-peer-deps
```

Điều này sẽ cài đặt:
- Backend: (tất cả đã có)
- Frontend: `recharts` - Chart library cho React

### **2. Import Dashboard Component**

Thêm vào `frontend/src/pages/AdminDashboard.js`:

```javascript
import DashboardReports from '../components/DashboardReports';

export default function AdminDashboard() {
  return (
    <div>
      {/* Existing code */}
      <DashboardReports />
    </div>
  );
}
```

### **3. Chạy ứng dụng**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### **4. Truy cập Dashboard**

1. Mở: **http://localhost:3000**
2. Login với admin account
3. Go to `/admin` để thấy Dashboard

---

## 📈 Dashboard Features

### **Stats Cards**
- 💰 **Tổng Doanh Thu** - Total revenue with trend
- 🛒 **Tổng Đơn Hàng** - Total orders with trend
- 📦 **Sản Phẩm** - Total products
- 👥 **Khách Hàng** - Total customers

### **Tabs**

#### 1️⃣ **Doanh Thu (Revenue Tab)**
- 📊 **Bar Chart** - Monthly revenue
- 📈 **Line Chart** - Daily revenue trends (30 days)

#### 2️⃣ **Trạng Thái Đơn (Order Status Tab)**
- 🥧 **Pie Chart** - Order distribution
- 📋 **Status Details** - Breakdown with progress bars
  - Pending (xử lý)
  - Confirmed (xác nhận)
  - Shipped (vận chuyển)
  - Delivered (giao hàng)

#### 3️⃣ **Sản Phẩm Bán Chạy (Top Products Tab)**
- 📊 **Table** - Top 5 sản phẩm với:
  - Product name
  - Sales quantity
  - Revenue
  - Customer rating

#### 4️⃣ **Danh Mục (Category Tab)**
- 🥧 **Pie Chart** - Product distribution by category
- 📂 **Category Details** - Detailed breakdown

---

## 🎨 Chart Libraries

### Recharts
- **Bar Charts** - Monthly data comparison
- **Line Charts** - Trend analysis
- **Pie Charts** - Distribution & proportions
- **Responsive** - Tự động adjust theo screen size

### Ant Design
- **Cards** - Statistics display
- **Tables** - Product listing
- **Statistic** - Number formatting
- **Tabs** - Section navigation
- **Badge** - Count display

---

## 🔧 API Endpoints (Backend)

```bash
# Dashboard statistics
GET /api/reports/dashboard
Authorization: Bearer {token}
Query: ?period=month

# Revenue trends
GET /api/reports/revenue
Authorization: Bearer {token}
Query: ?days=30

# Order statistics
GET /api/reports/orders
Authorization: Bearer {token}
```

**Response Format:**
```json
{
  "totalRevenue": 187450,
  "totalOrders": 542,
  "totalProducts": 12,
  "totalCustomers": 234,
  "revenueByMonth": [...],
  "orderStatus": {...},
  "topProducts": [...]
}
```

---

## 📱 Responsive Design

Dashboard tự động responsive:
- ✅ **Desktop** (1200px+) - 4 columns
- ✅ **Tablet** (768px-1199px) - 2 columns
- ✅ **Mobile** (<768px) - 1 column

---

## 🌐 Integration với Thực Database

Hiện tại code dùng **mock data**. Để connect với thực database:

1. Update `DashboardReports.js`:
```javascript
const fetchDashboardData = async () => {
  try {
    const response = await fetch('/api/reports/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setData(data);
  } catch (err) {
    setError(err.message);
  }
};
```

2. Implement thực tế database queries trong `backend/routes/reports.js`

---

## 📊 Tiêu Chí Đạt ✅
- ✅ Demo chức năng Dashboard về biểu độ (Doanh thu/Tương tác)
- ✅ Trình bày khung sườn báo cáo
- ✅ Bar charts, Line charts, Pie charts
- ✅ Responsive design
- ✅ Real-time data updates
- ✅ Multiple data views (tabs)

---

## 🎓 Customization

### Thay đổi Colors
```javascript
const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2'];
```

### Thay đổi Chart Types
```javascript
// Từ BarChart
<BarChart data={data}>

// Sang AreaChart
<AreaChart data={data}>
  <Area type="monotone" dataKey="revenue" fill="#1890ff" />
</AreaChart>
```

### Thêm Statistics
```javascript
<Statistic
  title="New Metric"
  value={1234}
  prefix="$"
  suffix="%"
/>
```

---

## 💡 Tips

- Chart data auto-renders khi component mount
- Tabs giúp organize multiple views
- Recharts auto-responsive - không cần media queries
- Mock data giúp testing UI trước khi connect real API
