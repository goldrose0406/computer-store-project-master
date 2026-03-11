import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return (
          <div className="admin-content">
            <h2>Quản lý Sản phẩm</h2>
            <p>Danh sách sản phẩm sẽ được hiển thị ở đây</p>
          </div>
        );
      case 'orders':
        return (
          <div className="admin-content">
            <h2>Quản lý Đơn hàng</h2>
            <p>Danh sách đơn hàng sẽ được hiển thị ở đây</p>
          </div>
        );
      case 'users':
        return (
          <div className="admin-content">
            <h2>Quản lý Người dùng</h2>
            <p>Danh sách người dùng sẽ được hiển thị ở đây</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="admin-content">
            <h2>Thống kê & Báo cáo</h2>
            <p>Biểu đồ thống kê sẽ được hiển thị ở đây</p>
          </div>
        );
      default:
        return (
          <div className="admin-content">
            <h2>Bảng điều khiển Admin</h2>
            <p>Chào mừng đến trang quản trị viên!</p>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Tổng sản phẩm</h3>
                <p className="stat-number">1,234</p>
              </div>
              <div className="stat-card">
                <h3>Tổng đơn hàng</h3>
                <p className="stat-number">567</p>
              </div>
              <div className="stat-card">
                <h3>Tổng doanh thu</h3>
                <p className="stat-number">50M VNĐ</p>
              </div>
              <div className="stat-card">
                <h3>Tổng người dùng</h3>
                <p className="stat-number">890</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="admin-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="admin-main">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
