import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Table, Button, Message, Tag, Spin, Statistic, Space, Select, Modal, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import '../styles/AdminDashboard.css';

const { Content } = Layout;

const StaffDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Check if user is staff
  useEffect(() => {
    if (user && user.role !== 'staff') {
      navigate('/');
      message.error('Bạn không có quyền truy cập trang này');
    }
  }, [user, navigate]);

  // Load orders
  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await ordersService.getAllOrders(token);
      if (result.success) {
        setOrders(result.orders);
      } else {
        message.error('Không thể tải đơn hàng');
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      message.warning('Vui lòng chọn trạng thái');
      return;
    }

    setUpdatingStatus(true);
    try {
      const result = await ordersService.updateOrderStatus(selectedOrder.id, newStatus, token);
      if (result.success) {
        message.success('Cập nhật trạng thái thành công');
        setIsStatusModalOpen(false);
        setSelectedOrder(null);
        setNewStatus(null);
        loadOrders();
      } else {
        message.error(result.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'shipped':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined />;
      case 'confirmed':
        return <CheckCircleOutlined />;
      case 'shipped':
        return <FileTextOutlined />;
      case 'delivered':
        return <CheckCircleOutlined />;
      default:
        return null;
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail'
    },
    {
      title: 'Điện Thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone'
    },
    {
      title: 'Số Lượng',
      dataIndex: 'totalItems',
      key: 'totalItems',
      render: (totalItems) => `${totalItems} item(s)`
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `₫${totalPrice.toLocaleString('vi-VN')}`
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status === 'pending' && 'Chờ Xử Lý'}
          {status === 'confirmed' && 'Đã Xác Nhận'}
          {status === 'shipped' && 'Đã Gửi'}
          {status === 'delivered' && 'Đã Giao'}
          {status === 'cancelled' && 'Đã Hủy'}
        </Tag>
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedOrder(record);
            setNewStatus(record.status);
            setIsStatusModalOpen(true);
          }}
        >
          Cập Nhật
        </Button>
      )
    }
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>📦 Bảng Điều Khiển Nhân Viên</h1>
            <p style={{ color: '#666', margin: 0 }}>Quản lý và cập nhật trạng thái đơn hàng</p>
          </div>

          {/* Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={12} sm={8} md={4.8}>
              <Card>
                <Statistic
                  title="Tổng Đơn"
                  value={orderStats.total}
                  prefix={<UnorderedListOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4.8}>
              <Card>
                <Statistic
                  title="Chờ Xử Lý"
                  value={orderStats.pending}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4.8}>
              <Card>
                <Statistic
                  title="Đã Xác Nhận"
                  value={orderStats.confirmed}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4.8}>
              <Card>
                <Statistic
                  title="Đã Gửi"
                  value={orderStats.shipped}
                  valueStyle={{ color: '#13c2c2' }}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4.8}>
              <Card>
                <Statistic
                  title="Đã Giao"
                  value={orderStats.delivered}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card style={{ marginBottom: '24px' }}>
            <Space>
              <span>Lọc theo trạng thái:</span>
              <Select
                style={{ width: 200 }}
                placeholder="Chọn trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                options={[
                  { label: 'Tất Cả', value: null },
                  { label: 'Chờ Xử Lý', value: 'pending' },
                  { label: 'Đã Xác Nhận', value: 'confirmed' },
                  { label: 'Đã Gửi', value: 'shipped' },
                  { label: 'Đã Giao', value: 'delivered' }
                ]}
              />
              <Button type="primary" onClick={loadOrders}>
                Làm Mới
              </Button>
            </Space>
          </Card>

          {/* Orders Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredOrders.map(order => ({ ...order, key: order.id }))}
              pagination={{ pageSize: 15 }}
              responsive
              scroll={{ x: 1000 }}
            />
          </Card>
        </div>

        {/* Update Status Modal */}
        <Modal
          title="Cập Nhật Trạng Thái Đơn Hàng"
          open={isStatusModalOpen}
          onOk={handleUpdateStatus}
          onCancel={() => {
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
            setNewStatus(null);
          }}
          confirmLoading={updatingStatus}
        >
          {selectedOrder && (
            <div>
              <p><strong>Mã Đơn:</strong> #{selectedOrder.id}</p>
              <p><strong>Khách Hàng:</strong> {selectedOrder.customerName}</p>
              <p><strong>Trạng Thái Hiện Tại:</strong> {selectedOrder.status}</p>
              <div style={{ marginTop: '16px' }}>
                <label><strong>Trạng Thái Mới:</strong></label>
                <Select
                  style={{ width: '100%', marginTop: '8px' }}
                  value={newStatus}
                  onChange={setNewStatus}
                  options={[
                    { label: 'Chờ Xử Lý', value: 'pending' },
                    { label: 'Đã Xác Nhận', value: 'confirmed' },
                    { label: 'Đã Gửi', value: 'shipped' },
                    { label: 'Đã Giao', value: 'delivered' },
                    { label: 'Đã Hủy', value: 'cancelled' }
                  ]}
                />
              </div>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default StaffDashboard;
