import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import { Card, Row, Col, Descriptions, Tag, Table, Button, Spin, message, Empty, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      message.warning('Vui lòng đăng nhập để xem chi tiết đơn hàng');
      navigate('/login', { replace: true });
      return;
    }

    if (user && token) {
      loadOrder();
    }
  }, [user, token, authLoading, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const [detailsResult, historyResult] = await Promise.all([
        ordersService.getOrderDetails(orderId, token),
        ordersService.getOrderStatusHistory(orderId, token)
      ]);

      if (!detailsResult.success) {
        message.error(detailsResult.message || 'Không thể tải chi tiết đơn hàng');
        return;
      }

      setOrder(detailsResult.order);
      setHistory(historyResult.success ? historyResult.history : []);
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  if (authLoading || loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!order) {
    return (
      <div style={{ padding: '40px' }}>
        <Empty description="Không tìm thấy đơn hàng" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Chi tiết đơn hàng #{order.id}</h1>
        <p style={{ color: '#666' }}>Xem chi tiết, trạng thái và lịch sử của đơn hàng.</p>
      </div>

      <Tabs defaultActiveKey="details">
        <Tabs.TabPane tab="Thông tin đơn hàng" key="details">
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">{new Date(order.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                  <Descriptions.Item label="Cập nhật cuối">{new Date(order.updatedAt || order.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Tên khách">{order.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">{order.customerPhone}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{order.customerAddress}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          <Card title="Sản phẩm đã đặt" style={{ marginBottom: '24px' }}>
            <Table
              dataSource={order.products}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
                { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: (price) => `${price?.toLocaleString('vi-VN')} ₫` },
                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Thành tiền', key: 'total', render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫` }
              ]}
            />
            <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '16px' }}>
              <strong>Tổng cộng: </strong>
              <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '18px' }}>{order.totalPrice?.toLocaleString('vi-VN')} ₫</span>
            </div>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Lịch sử trạng thái" key="history">
          <Card>
            {history.length > 0 ? (
              <Table
                dataSource={history}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', render: (value) => new Date(value).toLocaleString('vi-VN'), width: 180 },
                  { title: 'Trạng thái cũ', dataIndex: 'oldStatus', key: 'oldStatus', render: (value) => value ? <Tag color={getStatusColor(value)}>{getStatusLabel(value)}</Tag> : <span style={{ color: '#999' }}>Ban đầu</span> },
                  { title: 'Trạng thái mới', dataIndex: 'newStatus', key: 'newStatus', render: (value) => <Tag color={getStatusColor(value)}>{getStatusLabel(value)}</Tag> },
                  { title: 'Người thay đổi', dataIndex: 'changedByName', key: 'changedByName', render: (value) => value || 'Hệ thống' },
                  { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', render: (value) => value || '-' }
                ]}
              />
            ) : (
              <Empty description="Chưa có lịch sử trạng thái" />
            )}
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OrderDetailPage;
