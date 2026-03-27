import React, { useContext } from 'react';
import { Input, Badge, Button, Space, Dropdown, Avatar } from 'antd';
import { ShoppingCartOutlined, FacebookOutlined, InstagramOutlined, YoutubeOutlined, LinkedinOutlined, TikTokOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems, toggleCart } = useContext(CartContext);
  const { user, logout, isAdmin } = useAuth();

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

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'myorders',
      icon: <ShoppingOutlined />,
      label: 'Đơn Hàng Của Tôi',
      onClick: () => navigate('/my-orders')
    },
    ...(isAdmin ? [{
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Admin Dashboard',
      onClick: () => navigate('/admin')
    }] : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      onClick: () => {
        logout();
        navigate('/');
      }
    }
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
              padding: '0px'
            }}
            inputProps={{
              style: {
                background: 'transparent !important',
                border: 'none !important',
                borderRadius: '24px !important',
                color: '#fff !important',
              }
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

          {/* Cart, User & Auth Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Cart */}
            <Badge count={totalItems} showZero>
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ fontSize: '18px', color: '#ec4899' }} />}
                style={{ color: '#fff' }}
                onClick={toggleCart}
              />
            </Badge>

            {/* User Section */}
            {user ? (
              // Logged In - User Dropdown
              <Dropdown
                menu={{
                  items: userMenuItems
                }}
                trigger={['click']}
              >
                <Button
                  type="text"
                  style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Avatar size={24} icon={<UserOutlined />} style={{ background: '#7c3aed' }} />
                  <span style={{ fontSize: '12px' }}>{user.name}</span>
                </Button>
              </Dropdown>
            ) : (
              // Not Logged In - Auth Buttons
              <Space size="small">
                <Button
                  type="default"
                  size="small"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
                  onClick={() => navigate('/login')}
                >
                  Đăng Nhập
                </Button>
                <Button
                  type="primary"
                  size="small"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
                  onClick={() => navigate('/register')}
                >
                  Đăng Ký
                </Button>
              </Space>
            )}
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
