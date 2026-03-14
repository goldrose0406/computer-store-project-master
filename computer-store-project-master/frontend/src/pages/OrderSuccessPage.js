import React, { useEffect } from 'react';
import { Result, Button, Card, Row, Col, Table, Divider, Tooltip } from 'antd';
import { HomeOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/OrderSuccess.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Nếu không có orderData, redirect về home
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫`
    }
  ];

  return (
    <div className="order-success-page">
      {/* Success Result */}
      <Result
        status="success"
        title={<span className="success-title">🎉 Đặt Hàng Thành Công! 🎉</span>}
        subTitle="Cảm ơn bạn đã tin tưởng Computer Store. Chúng tôi sẽ liên hệ sớm nhất!"
        style={{ marginBottom: '40px' }}
      />

      {/* Order Details Card */}
      <Row gutter={[24, 24]}>
        {/* Left: Order Info */}
        <Col xs={24} md={12}>
          <Card 
            title={<span><CheckCircleOutlined style={{color: '#52c41a', marginRight: '8px'}} /> Thông Tin Đơn Hàng</span>}
            className="order-info-card"
          >
            <div className="info-row">
              <span className="info-label">📦 Mã đơn hàng:</span>
              <span className="info-value order-id">#{orderData.orderId}</span>
            </div>

            <div className="info-row">
              <span className="info-label">👤 Tên khách hàng:</span>
              <span className="info-value">{orderData.customerName}</span>
            </div>

            <div className="info-row">
              <span className="info-label">📧 Email:</span>
              <span className="info-value">{orderData.customerEmail}</span>
            </div>

            <div className="info-row">
              <span className="info-label">📱 Số điện thoại:</span>
              <span className="info-value">{orderData.customerPhone}</span>
            </div>

            <div className="info-row">
              <span className="info-label">🏠 Địa chỉ giao hàng:</span>
              <span className="info-value">{orderData.customerAddress}</span>
            </div>

            <Divider />

            <div className="info-row">
              <span className="info-label">📊 Trạng thái:</span>
              <span className="info-value status-badge pending">⏳ Chờ xử lý</span>
            </div>

            <div className="info-row">
              <span className="info-label">🕐 Thời gian đặt:</span>
              <span className="info-value">{new Date().toLocaleString('vi-VN')}</span>
            </div>
          </Card>
        </Col>

        {/* Right: Summary */}
        <Col xs={24} md={12}>
          <Card 
            title={<span><ShoppingOutlined style={{marginRight: '8px'}} /> Tóm Tắt Đơn Hàng</span>}
            className="order-summary-card"
          >
            <Table
              columns={columns}
              dataSource={orderData.products}
              pagination={false}
              rowKey="id"
              size="small"
              style={{ marginBottom: '20px' }}
            />

            <Divider />

            <div className="summary-row">
              <span className="summary-label">Số lượng sản phẩm:</span>
              <span className="summary-value">{orderData.totalItems} sản phẩm</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Tổng tiền:</span>
              <span className="summary-value total-price">
                {orderData.totalPrice.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            {orderData.notes && (
              <>
                <Divider />
                <div className="summary-row">
                  <span className="summary-label">Ghi chú:</span>
                  <span className="summary-value">{orderData.notes}</span>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Info Messages */}
      <Card className="info-message-card" style={{ marginTop: '30px' }}>
        <div className="message-item">
          <span className="message-icon">📦</span>
          <span>Đơn hàng sẽ được xác nhận trong <strong>24 giờ</strong></span>
        </div>
        <div className="message-item">
          <span className="message-icon">🚚</span>
          <span>Giao hàng dự kiến trong <strong>3-5 ngày làm việc</strong></span>
        </div>
        <div className="message-item">
          <span className="message-icon">📞</span>
          <span>Chúng tôi sẽ <strong>gọi</strong> để xác nhận thông tin giao hàng</span>
        </div>
        <div className="message-item">
          <span className="message-icon">✅</span>
          <span>Thanh toán khi nhận hàng hoặc chuyển khoản trước</span>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Tooltip title="Quay lại trang chủ">
          <Button 
            type="primary" 
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Quay Lại Trang Chủ
          </Button>
        </Tooltip>

        <Tooltip title="Xem danh sách đơn hàng của bạn">
          <Button 
            type="default" 
            size="large"
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/my-orders')}
            className="btn-secondary"
          >
            Xem Đơn Hàng Của Tôi
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
