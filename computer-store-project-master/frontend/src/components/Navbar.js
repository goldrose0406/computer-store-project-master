import React, { useContext } from 'react';
import { Input, Badge, Button, Space } from 'antd';
import { ShoppingCartOutlined, FacebookOutlined, InstagramOutlined, YoutubeOutlined, LinkedinOutlined, TikTokOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems, toggleCart } = useContext(CartContext);

  const menuItems = [
    'SẢN PHẨM',
    'GIẢI PHÁP ĐỒ HỌA',
    'GIẢI PHÁP DOANH NGHIỆP',
    'THU CŨ ĐỔI MỚI PC',
    'CHÍNH SÁCH TỔNG HỢP',
    'KHUYẾN MÃI',
    'TIN TỨC',
    'LIÊN HỆ'
  ];

  return (
    <nav style={{ 
      background: '#000000', 
      padding: '16px 40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      borderBottom: '1px solid #333',
      color: '#fff'
    }}>
      {/* Top Section - Logo & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* Left: Logo */}
        <Link to="/" style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}>
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', padding: '6px 12px', borderRadius: '4px' }}>
            Nhóm 10 Store
          </span>
        </Link>

        {/* Center: Search */}
        <div style={{ flex: 1, margin: '0 40px' }}>
          <Input.Search
            placeholder="Bạn đang tìm sản phẩm nào?"
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #555',
              borderRadius: '24px',
              padding: '0px'
            }}
            className="custom-search"
            allowClear
          />
        </div>

        {/* Right: Info Section */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {/* Hotline */}
          <div style={{ textAlign: 'right', fontSize: '12px', borderRight: '1px solid #444', paddingRight: '20px' }}>
            <div style={{ color: '#888' }}>HOTLINE HỖ TRỢ</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>0123.456.789</div>
          </div>

          {/* Shipping */}
          <div style={{ textAlign: 'right', fontSize: '12px', borderRight: '1px solid #444', paddingRight: '20px' }}>
            <div style={{ color: '#888' }}>GIAO HÀNG CẢ NƯỚC</div>
            <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ec4899' }}>Freeshipping HCM</div>
          </div>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '12px', borderRight: '1px solid #444', paddingRight: '20px' }}>
            <FacebookOutlined style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7, color: '#fff' }} />
            <InstagramOutlined style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7, color: '#fff' }} />
            <YoutubeOutlined style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7, color: '#fff' }} />
            <LinkedinOutlined style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7, color: '#fff' }} />
            <TikTokOutlined style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7, color: '#fff' }} />
          </div>

          {/* Cart & Price */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Badge count={totalItems} showZero>
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ fontSize: '18px', color: '#ec4899' }} />}
                style={{ color: '#fff' }}
                onClick={toggleCart}
              />
            </Badge>
            <div style={{ fontWeight: 'bold', color: '#ec4899', fontSize: '13px', minWidth: '100px' }}>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Menu */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid #333', paddingTop: '12px' }}>
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => item === 'SẢN PHẨM' && navigate('/products')}
            style={{
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              opacity: 0.8,
              transition: 'opacity 0.3s',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            {item}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
