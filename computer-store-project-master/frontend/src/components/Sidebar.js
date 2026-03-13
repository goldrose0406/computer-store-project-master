import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShoppingOutlined, UserOutlined, FileTextOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapsed = false }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin')
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
      children: [
        {
          key: 'products-list',
          label: 'Danh sách',
          onClick: () => navigate('/admin/products')
        },
        {
          key: 'products-add',
          label: 'Thêm mới',
          onClick: () => navigate('/admin/products/add')
        }
      ]
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: 'Đơn hàng',
      onClick: () => navigate('/admin/orders')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Khách hàng',
      onClick: () => navigate('/admin/users')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cấu hình',
      onClick: () => navigate('/admin/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Quay về trang chủ',
      onClick: () => navigate('/')
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={200}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={menuItems}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
