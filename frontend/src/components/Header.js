import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div className="store-name">Laptop Store</div>
        <div className="header-info">
          <span>🏠 Trang chủ</span>
          <span className="divider">/</span>
          <span>💰 Laptop</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
