import React, { useEffect, useState } from 'react';
import { Table, Card, Empty, Button, Spin, message, Tag, Modal, Descriptions } from 'antd';
import { ShoppingOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import '../styles/MyOrders.css';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Nếu chưa login, redirect đến login
    if (!authLoading && !user) {
      message.warning('Vui lòng đăng nhập để xem đơn hàng!');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch danh sách đơn hàng
    if (user && token) {
      fetchOrders();
    }
  }, [user, token, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await ordersService.getMyOrders(token);

      if (!result.success) {
        message.error(result.message || 'Lỗi khi lấy danh sách đơn hàng');
        return;
      }

      setOrders(result.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setLoading(true);
      const result = await ordersService.getOrderDetails(orderId, token);

      if (!result.success) {
        message.error(result.message || 'Lỗi khi lấy chi tiết đơn hàng');
        return;
      }

      setSelectedOrder(result.order);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'processing': 'blue',
      'shipped': 'cyan',
      'delivered': 'green',
      'cancelled': 'red'
    };
    const labels = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đã gửi',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return { color: colors[status] || 'default', label: labels[status] || status };
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong>#{id}</strong>,
      width: 100
    },
    {
      title: 'Tên khách',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
        {price.toLocaleString('vi-VN')} ₫
      </span>
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalItems',
      key: 'totalItems',
      render: (items) => `${items} sản phẩm`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, label } = getStatusColor(status);
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  if (authLoading || loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!user) {
    return (
      <Empty
        description="Vui lòng đăng nhập để xem đơn hàng"
        style={{ padding: '40px' }}
      />
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingOutlined /> Đơn hàng của tôi
        </h1>
        <p style={{ color: '#666' }}>Xem và quản lý các đơn hàng của bạn</p>
      </div>

      {/* Orders Table */}
      <Card>
        {orders.length > 0 ? (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            responsive
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="Bạn chưa có đơn hàng nào" />
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedOrder(null);
        }}
        width={800}
        footer={null}
      >
        {selectedOrder && (
          <>
            {/* Basic Info */}
            <Descriptions column={2} bordered style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status).color}>
                  {getStatusColor(selectedOrder.status).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách" span={2}>
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {selectedOrder.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại" span={2}>
                {selectedOrder.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedOrder.customerAddress}
              </Descriptions.Item>
            </Descriptions>

            {/* Products */}
            <h3>Sản phẩm đã đặt</h3>
            <Table
              columns={[
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `${price?.toLocaleString('vi-VN')} ₫`
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity'
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫`
                }
              ]}
              dataSource={selectedOrder.products}
              pagination={false}
              rowKey="id"
            />

            {/* Summary */}
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                <strong>Tổng cộng: </strong>
                <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '24px' }}>
                  {selectedOrder.totalPrice?.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyOrdersPage;
