import React, { useEffect, useState } from 'react';
import { Table, Card, Empty, Button, Spin, message, Tag, Modal, Descriptions, Tabs, Input, DatePicker, Row, Col, Space, Select } from 'antd';
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
  const [orderStatusHistory, setOrderStatusHistory] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

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

  const fetchOrders = async (page = orderPage, limit = orderLimit) => {
    try {
      setLoading(true);
      const result = await ordersService.getMyOrders(token, {
        search: orderSearch,
        startDate: dateRange[0]?.format?.('YYYY-MM-DD') || undefined,
        endDate: dateRange[1]?.format?.('YYYY-MM-DD') || undefined,
        sortBy,
        sortOrder,
        page,
        limit
      });

      if (!result.success) {
        message.error(result.message || 'Lỗi khi lấy danh sách đơn hàng');
        return;
      }

      setOrders(result.orders || []);
      setPagination(result.pagination || { total: 0, page, limit });
      setOrderPage(page);
      setOrderLimit(limit);
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
      const [detailsResult, historyResult] = await Promise.all([
        ordersService.getOrderDetails(orderId, token),
        ordersService.getOrderStatusHistory(orderId, token)
      ]);

      if (!detailsResult.success) {
        message.error(detailsResult.message || 'Lỗi khi lấy chi tiết đơn hàng');
        return;
      }

      setSelectedOrder(detailsResult.order);
      if (historyResult.success) {
        setOrderStatusHistory(historyResult.history);
      } else {
        setOrderStatusHistory([]);
      }
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
          onClick={() => navigate(`/order/${record.id}`)}
        >
          Xem trang chi tiết
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
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn, email hoặc tên khách"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates || [null, null])}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              value={`${sortBy}_${sortOrder}`}
              onChange={(value) => {
                const [field, order] = value.split('_');
                setSortBy(field);
                setSortOrder(order);
              }}
              style={{ width: '100%' }}
              options={[
                { label: 'Ngày tạo: mới nhất', value: 'createdAt_desc' },
                { label: 'Ngày tạo: cũ nhất', value: 'createdAt_asc' },
                { label: 'Giá trị: tăng dần', value: 'totalPrice_asc' },
                { label: 'Giá trị: giảm dần', value: 'totalPrice_desc' }
              ]}
            />
          </Col>
          <Col xs={24} md={4} style={{ display: 'flex', alignItems: 'center' }}>
            <Space>
              <Button
                type="primary"
                onClick={() => fetchOrders(1, orderLimit)}
              >
                Áp dụng
              </Button>
              <Button
                onClick={() => {
                  setOrderSearch('');
                  setDateRange([null, null]);
                  setSortBy('createdAt');
                  setSortOrder('desc');
                  fetchOrders(1, orderLimit);
                }}
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>

        {orders.length > 0 ? (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            responsive
            pagination={{
              current: orderPage,
              pageSize: orderLimit,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onChange: (page, pageSize) => fetchOrders(page, pageSize)
            }}
          />
        ) : (
          <Empty description="Bạn chưa có đơn hàng nào" />
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedOrder(null);
          setOrderStatusHistory([]);
        }}
        width={900}
        footer={null}
      >
        {selectedOrder && (
          <>
            <Tabs defaultActiveKey="details">
              <Tabs.TabPane tab="Chi tiết đơn hàng" key="details">
                <Descriptions column={2} bordered style={{ marginBottom: '24px' }}>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(selectedOrder.status).color}>
                      {getStatusColor(selectedOrder.status).label}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật cuối" span={2}>
                    {new Date(selectedOrder.updatedAt || selectedOrder.createdAt).toLocaleString('vi-VN')}
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

                <h3 style={{ marginBottom: 16 }}>Sản phẩm đã đặt</h3>
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
                  size="small"
                />

                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                    <strong>Tổng cộng: </strong>
                    <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '24px' }}>
                      {selectedOrder.totalPrice?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Lịch sử trạng thái" key="history">
                {orderStatusHistory.length > 0 ? (
                  <Table
                    columns={[
                      {
                        title: 'Thời gian',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (date) => new Date(date).toLocaleString('vi-VN'),
                        width: 180
                      },
                      {
                        title: 'Trạng thái cũ',
                        dataIndex: 'oldStatus',
                        key: 'oldStatus',
                        render: (status) => status ? (
                          <Tag color={getStatusColor(status).color}>{getStatusColor(status).label}</Tag>
                        ) : <span style={{ color: '#999' }}>Trạng thái ban đầu</span>
                      },
                      {
                        title: 'Trạng thái mới',
                        dataIndex: 'newStatus',
                        key: 'newStatus',
                        render: (status) => <Tag color={getStatusColor(status).color}>{getStatusColor(status).label}</Tag>
                      },
                      {
                        title: 'Người thay đổi',
                        dataIndex: 'changedByName',
                        key: 'changedByName',
                        render: (name) => name || 'Hệ thống'
                      },
                      {
                        title: 'Ghi chú',
                        dataIndex: 'notes',
                        key: 'notes',
                        render: (notes) => notes || '-'
                      }
                    ]}
                    dataSource={orderStatusHistory}
                    pagination={false}
                    rowKey="id"
                    size="small"
                  />
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
                    Chưa có lịch sử thay đổi trạng thái
                  </div>
                )}
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MyOrdersPage;
