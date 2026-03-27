# 🐳 Docker Setup Guide - Computer Store

## ✅ Tệp đã tạo
- `backend/Dockerfile` - Image cho Backend (Node.js)
- `frontend/Dockerfile` - Image cho Frontend (React)
- `docker-compose.yml` - Orche­stration (1 lệnh chạy tất cả)
- `.env.example` - Cấu hình mẫu

---

## 🚀 Chạy với "One Click"

### **Option 1: Dùng Docker Compose (Khuyến khích)**

```bash
# Từ thư mục gốc project
docker-compose up -d --build
```

✅ Cái này sẽ:
- Build Backend image
- Build Frontend image  
- Start cả 2 services
- Tạo network để communicate

### **Option 2: Dùng Docker riêng lẻ**

**Backend:**
```bash
cd backend
docker build -t computer-store-backend .
docker run -p 5000:5000 computer-store-backend
```

**Frontend:**
```bash
cd frontend
docker build -t computer-store-frontend .
docker run -p 3000:3000 computer-store-frontend
```

---

## 📱 Truy cập ứng dụng

| Dịch vụ | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

---

## 📋 Các lệnh hữu ích

```bash
# Xem logs các container
docker-compose logs -f

# Stop tất cả containers
docker-compose down

# Xóa images và volumes
docker-compose down -v --rmi all

# View running containers
docker ps

# View all containers
docker ps -a

# Stop 1 container cụ thể
docker stop computer-store-backend
```

---

## ⚙️ Cấu hình Environment

1. Tạo `.env` từ `.env.example`:
```bash
cp .env.example .env
```

2. Chỉnh sửa `.env` nếu cần (ports, database, JWT, etc.)

---

## 🛠️ Troubleshooting

### Port đã bị dùng?
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # Frontend ở port 3001
  - "5001:5000"  # Backend ở port 5001
```

### Container không start?
```bash
# Xem chi tiết lỗi
docker logs computer-store-backend
docker logs computer-store-frontend
```

### Rebuild images?
```bash
docker-compose up -d --build --force-recreate
```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│     Docker Host (localhost)         │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Frontend Container         │   │
│  │  Port: 3000                 │   │
│  │  Image: computer-store-fe   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Backend Container          │   │
│  │  Port: 5000                 │   │
│  │  Image: computer-store-be   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Network: computer-store-...|   │
│  │  (for inter-container comm) │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## ✨ Tiêu chí đạt ✅
- ✅ Hệ thống chạy ổn định trên Docker
- ✅ Không lỗi crash khi deploy
- ✅ One Click deployment với `docker-compose up`
