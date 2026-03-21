import React, { useContext, useState } from 'react';
import { Form, Input, Button, Card, message, Spin, Row, Col, Table, Divider } from 'antd';
import { PhoneOutlined, HomeOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user, token } = useAuth();

  // Nếu chưa login, redirect đến login
  React.useEffect(() => {
    if (!user) {
      message.warning('Vui lòng đăng nhập trước khi đặt hàng!');
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Pre-fill form nếu user đã login
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        customerName: user.name,
        customerEmail: user.email
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    if (cartItems.length === 0) {
      message.error('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        products: cartItems,
        totalPrice,
        notes: values.notes || ''
      };

      const result = await ordersService.createOrder(orderData, token);

      if (!result.success) {
        message.error(result.message || 'Đặt hàng thất bại');
        setLoading(false);
        return;
      }

      // Tạo order data để gửi đến success page
      const successOrderData = {
        orderId: result.orderId,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        products: cartItems,
        totalPrice,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        notes: values.notes || ''
      };

      message.success(`Đặt hàng thành công! Mã đơn: ${result.orderId}`);
      clearCart();
      
      // Redirect đến success page với dữ liệu order
      setTimeout(() => {
        setLoading(false);
        navigate('/order-success', { 
          state: { orderData: successOrderData },
          replace: true 
        });
      }, 1000);
    } catch (error) {
      message.error('Lỗi: ' + error.message);
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2>🛒 Giỏ hàng trống</h2>
            <p>Vui lòng thêm sản phẩm trước khi thanh toán</p>
            <Button type="primary" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name'
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
      key: 'quantity'
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫`
    }
  ];

  return (
    <div className="checkout-page">
      <Row gutter={[24, 24]}>
        {/* Thông tin đơn hàng */}
        <Col xs={24} md={12}>
          <Card title="📋 Thông tin đơn hàng">
            <Table
              columns={columns}
              dataSource={cartItems}
              pagination={false}
              rowKey="id"
              size="small"
            />
            <Divider />
            <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'right' }}>
              Tổng cộng: <span style={{ color: '#ff4d4f' }}>{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
          </Card>
        </Col>

        {/* Form thông tin khách hàng */}
        <Col xs={24} md={12}>
          <Card title="👤 Thông tin giao hàng">
            <Spin spinning={loading}>
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item
                  label="Tên khách hàng"
                  name="customerName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nguyễn Văn A"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="customerEmail"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="email@example.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="customerPhone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải 10 chữ số' }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="0123456789"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ giao hàng"
                  name="customerAddress"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ' }
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Ghi chú (tuỳ chọn)"
                  name="notes"
                >
                  <Input.TextArea
                    placeholder="Ghi chú thêm về đơn hàng..."
                    rows={3}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    ✅ Đặt Hàng Ngay ({totalPrice.toLocaleString('vi-VN')} ₫)
                  </Button>
                </Form.Item>

                <Button
                  block
                  size="large"
                  onClick={() => navigate('/products')}
                >
                  ← Tiếp tục mua hàng
                </Button>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
