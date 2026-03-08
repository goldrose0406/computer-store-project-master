import React from 'react';
import '../styles/Header.css';

function Header() {
  const categories = [
    { id: 1, name: 'Laptop', icon: '💻' },
    { id: 2, name: 'PC', icon: '🖥️' },
    { id: 3, name: 'Màn hình', icon: '📺' },
    { id: 4, name: 'Build PC', icon: '🔧' },
    { id: 5, name: 'Linh kiện máy tính', icon: '⚙️' },
    { id: 6, name: 'Máy in', icon: '🖨️' }
  ];

  return (
    <header className="header">
      <div className="header-top">
        <div className="store-name">Cửa Hàng Máy Tính</div>
        <div className="header-info">
          <span>🏠 Trang chủ</span>
          <span className="divider">/</span>
          <span>💰 Laptop</span>
        </div>
      </div>
      
      <nav className="navbar">
        {categories.map(cat => (
          <div key={cat.id} className="nav-item">
            <span className="nav-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </div>
        ))}
      </nav>
    </header>
  );
}

export default Header;
