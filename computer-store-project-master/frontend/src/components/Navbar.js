import React, { useContext, useEffect, useState } from 'react';
import { Input, Badge, Button, Space, Dropdown, Avatar } from 'antd';
import {
  ShoppingCartOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const productDropdownItems = [
  { label: 'PC Gaming New', path: '/products/pc-gaming-new' },
  { label: 'PC Gaming Old', path: '/products/pc-gaming-old' },
  { label: 'Laptop', path: '/products/laptop' }
];

const menuItems = [
  {
    label: 'SẢN PHẨM',
    path: '/products/pc-gaming-new',
    dropdown: productDropdownItems
  },
  { label: 'GIẢI PHÁP ĐỒ HỌA' },
  { label: 'GIẢI PHÁP DOANH NGHIỆP' },
  { label: 'THU CŨ ĐỔI MỚI PC' },
  { label: 'CHÍNH SÁCH TỔNG HỢP' },
  { label: 'KHUYẾN MÃI' },
  { label: 'TIN TỨC' },
  { label: 'LIÊN HỆ' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, toggleCart } = useContext(CartContext);
  const { user, logout, isAdmin, setLoginModalOpen } = useAuth();
  const [isCompact, setIsCompact] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const shouldUseStickyNavbar =
    location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/product/');

  useEffect(() => {
    if (!shouldUseStickyNavbar) {
      setIsCompact(false);
      return undefined;
    }

    const handleScroll = () => {
      setIsCompact(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldUseStickyNavbar]);

  const userMenuItems = [
    {
      key: 'myorders',
      icon: <ShoppingOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => navigate('/my-orders')
    },
    ...(isAdmin
      ? [
          {
            key: 'admin',
            icon: <DashboardOutlined />,
            label: 'Admin Dashboard',
            onClick: () => navigate('/admin')
          }
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        logout();
        navigate('/');
      }
    }
  ];

  return (
    <nav
      className={`site-navbar ${shouldUseStickyNavbar ? 'site-navbar--product' : ''} ${
        isCompact ? 'site-navbar--compact' : ''
      }`}
    >
      <div className="site-navbar__top">
        <Link to="/" className="site-navbar__logo-link">
          <span className="site-navbar__logo-badge">Nhóm 10 Store</span>
        </Link>

        <div className="site-navbar__search">
          <Input.Search placeholder="Bạn đang tìm sản phẩm nào?" className="custom-search" allowClear />
        </div>

        <div className="site-navbar__right">
          <div className="site-navbar__info-card">
            <div className="site-navbar__info-label">HOTLINE HỖ TRỢ</div>
            <div className="site-navbar__info-value">0123.456.789</div>
          </div>

          <div className="site-navbar__info-card">
            <div className="site-navbar__info-label">GIAO HÀNG CẢ NƯỚC</div>
            <div className="site-navbar__info-value site-navbar__info-value--highlight">
              Freeshipping HCM
            </div>
          </div>

          <div className="site-navbar__socials">
            <FacebookOutlined className="site-navbar__social-icon" />
            <InstagramOutlined className="site-navbar__social-icon" />
            <YoutubeOutlined className="site-navbar__social-icon" />
            <LinkedinOutlined className="site-navbar__social-icon" />
            <TikTokOutlined className="site-navbar__social-icon" />
          </div>

          <div className="site-navbar__actions">
            <Badge count={totalItems} showZero>
              <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: '18px', color: '#ec4899' }} />}
                className="site-navbar__cart-button"
                onClick={toggleCart}
              />
            </Badge>

            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <Button type="text" className="site-navbar__user-button">
                  <Avatar size={24} icon={<UserOutlined />} style={{ background: '#7c3aed' }} />
                  <span className="site-navbar__user-name">{user.name}</span>
                </Button>
              </Dropdown>
            ) : (
              <Space size="small">
                <Button
                  type="default"
                  size="small"
                  className="site-navbar__auth-button"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Đăng Nhập
                </Button>
                <Button
                  type="primary"
                  size="small"
                  className="site-navbar__auth-button"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Đăng Ký
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>

      <div className="site-navbar__bottom">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="site-navbar__menu-wrap"
            onMouseEnter={() => setOpenDropdown(item.dropdown ? item.label : null)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <div
              onClick={() => item.path && navigate(item.path)}
              className={`site-navbar__menu-item ${
                item.dropdown && location.pathname.startsWith('/products') ? 'site-navbar__menu-item--active' : ''
              }`}
            >
              {item.label}
            </div>

            {item.dropdown && openDropdown === item.label && (
              <div className="site-navbar__dropdown">
                {item.dropdown.map((dropdownItem) => (
                  <button
                    key={dropdownItem.path}
                    type="button"
                    className="site-navbar__dropdown-item"
                    onClick={() => {
                      navigate(dropdownItem.path);
                      setOpenDropdown(null);
                    }}
                  >
                    {dropdownItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
