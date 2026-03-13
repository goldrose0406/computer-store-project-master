import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="header">
      {/* Top Header */}
      <div className="header-top">
        {/* Logo */}
        <div className="header-logo">
          <img src="/logolaptopweb.jpg" alt="HPC Store Logo" className="logo-img" />
          <span className="store-domain">HPC Store</span>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Bạn tìm gì..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <span>🔍 Tìm kiếm</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <Link to="/admin-dashboard" className="admin-link">
            <span className="admin-icon">⚙️</span>
            <span className="admin-text">Admin Dashboard</span>
          </Link>

          <div className="account-section">
            <span className="account-icon">👤</span>
            <div className="account-text">
              <div className="account-label">Đăng nhập/Đăng ký</div>
              <div className="account-name">Tài khoản</div>
            </div>
          </div>

          <div className="cart-section">
            <span className="cart-icon">🛒</span>
            <div className="cart-count">0</div>
            <div className="cart-text">Giỏ hàng</div>
          </div>
        </div>
      </div>


    </header>
  );
}

export default Header;
