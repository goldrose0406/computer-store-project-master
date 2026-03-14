import React, { useEffect, useState } from 'react';
import { Table, Card, Empty, Button, Spin, message, Tag, Tooltip } from 'antd';
import { ShoppingOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/MyOrders.css';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nếu chưa login, redirect đến login
    if (!user) {
      message.warning('Vui lòng đăng nhập để xem đơn hàng!');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch danh sách đơn hàng
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          message.error(data.message || 'Lỗi khi lấy danh sách đơn hàng');
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Lỗi: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  // Status mapping
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'processing': 'blue',
      'shipped': 'cyan',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': '⏳ Chờ xử lý',
      'processing': '📦 Đang xử lý',
      'shipped': '🚚 Đã gửi',
      'delivered': '✅ Đã giao',
      'cancelled': '❌ Đã hủy'
    };
    return labels[status] || status;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <strong>#{id}</strong>
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      width: 180,
      ellipsis: {
        showTitle: false
      },
      render: (email) => (
        <Tooltip title={email}>
          {email}
        </Tooltip>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalItems',
      key: 'totalItems',
      width: 80,
      align: 'center',
      render: (totalItems) => <strong>{totalItems} sản phẩm</strong>
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130,
      render: (totalPrice) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          {totalPrice.toLocaleString('vi-VN')} ₫
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString('vi-VN');
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
            style={{ background: '#667eea' }}
          >
            Chi tiết
          </Button>
        </Tooltip>
      )
    }
  ];

  const handleViewDetails = (orderId) => {
    message.info(`Xem chi tiết đơn hàng #${orderId}`);
    // TODO: Có thể thêm route chi tiết đơn hàng
  };

  if (!user) {
    return null;
  }

  return (
    <div className="my-orders-page">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingOutlined style={{ fontSize: '24px', color: '#667eea' }} />
            <span>Danh Sách Đơn Hàng Của Tôi</span>
          </div>
        }
        className="orders-card"
      >
        {/* Header Info */}
        <div className="orders-header">
          <p>
            Xin chào <strong>{user.name}</strong>, email: <strong>{user.email}</strong>
          </p>
          <p>Tổng cộng: <strong style={{ color: '#667eea', fontSize: '18px' }}>{orders.length}</strong> đơn hàng</p>
        </div>

        {/* Table */}
        <Spin spinning={loading}>
          {orders.length === 0 ? (
            <Empty
              description="Chưa có đơn hàng nào"
              style={{ marginTop: '40px', marginBottom: '40px' }}
            >
              <Button
                type="primary"
                onClick={() => navigate('/products')}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
              >
                Tiếp tục mua sắm
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: orders.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`
              }}
              size="middle"
              className="orders-table"
            />
          )}
        </Spin>

        {/* Back Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button
            onClick={() => navigate('/')}
            icon={<ArrowLeftOutlined />}
          >
            Quay Về Trang Chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MyOrdersPage;
