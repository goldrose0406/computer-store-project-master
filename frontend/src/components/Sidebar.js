import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: '📊' },
    { id: 'products', label: 'Sản phẩm', icon: '📦' },
    { id: 'orders', label: 'Đơn hàng', icon: '🛒' },
    { id: 'users', label: 'Người dùng', icon: '👥' },
    { id: 'analytics', label: 'Thống kê', icon: '📈' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Menu</h3>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
