import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Table, Button, Space, Statistic, Tabs, Modal, Form, Input, InputNumber, Select, message, Spin, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import { productsService } from '../services/productsService';
import '../styles/AdminDashboard.css';

const { Content } = Layout;

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();

  // Tải dữ liệu
  useEffect(() => {
    if (user?.isAdmin && token) {
      loadData();
    }
  }, [user, token]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Tải đơn hàng
      const ordersResult = await ordersService.getAllOrders(token);
      if (ordersResult.success) {
        setOrders(ordersResult.orders);
      }

      // Tải sản phẩm
      const productsResult = await productsService.getAllProducts({});
      if (productsResult.success) {
        setProducts(productsResult.products);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    try {
      const result = await productsService.createProduct(values, token);
      if (result.success) {
        message.success('Thêm sản phẩm thành công!');
        setIsAddProductModalVisible(false);
        productForm.resetFields();
        loadData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await productsService.deleteProduct(productId, token);
      if (result.success) {
        message.success('Xóa sản phẩm thành công!');
        loadData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await ordersService.updateOrderStatus(orderId, newStatus, token);
      if (result.success) {
        message.success('Cập nhật trạng thái thành công!');
        loadData();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
  };

  // Orders Table Columns
  const ordersColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>#{text}</strong>,
      width: 80
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail'
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (amount) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
        {amount?.toLocaleString('vi-VN')} ₫
      </span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { 'pending': 'orange', 'processing': 'blue', 'shipped': 'cyan', 'delivered': 'green', 'cancelled': 'red' };
        const labels = { 'pending': 'Chờ xử lý', 'processing': 'Đang xử lý', 'shipped': 'Đã gửi', 'delivered': 'Đã giao', 'cancelled': 'Đã hủy' };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
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
        <Select
          defaultValue={record.status}
          onChange={(value) => handleUpdateOrderStatus(record.id, value)}
          style={{ width: '120px' }}
          options={[
            { label: 'Chờ xử lý', value: 'pending' },
            { label: 'Đang xử lý', value: 'processing' },
            { label: 'Đã gửi', value: 'shipped' },
            { label: 'Đã giao', value: 'delivered' },
            { label: 'Đã hủy', value: 'cancelled' }
          ]}
        />
      )
    }
  ];

  // Products Table Columns
  const productsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand'
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price?.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<DeleteOutlined />} danger size="small" onClick={() => handleDeleteProduct(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
      width: 100
    }
  ];

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;

  if (!user?.isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Không có quyền truy cập</h2>
        <p>Bạn cần có quyền admin để truy cập</p>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          <Spin spinning={loading}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '0' }}>📊 Admin Dashboard</h1>
              </div>

              {/* Stats */}
              <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Tổng đơn hàng"
                      value={orders.length}
                      valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Sản phẩm"
                      value={products.length}
                      valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Doanh thu"
                      value={totalRevenue}
                      valueStyle={{ color: '#faad14', fontSize: '24px' }}
                      formatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Khách hàng"
                      value={uniqueCustomers}
                      valueStyle={{ color: '#ff7a45', fontSize: '24px' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Tabs */}
              <Card>
                <Tabs
                  items={[
                    {
                      key: 'orders',
                      label: '📋 Quản lý đơn hàng',
                      children: (
                        <div>
                          <Table
                            columns={ordersColumns}
                            dataSource={orders.map(order => ({ ...order, key: order.id }))}
                            pagination={{ pageSize: 10 }}
                            responsive
                            scroll={{ x: 800 }}
                          />
                        </div>
                      )
                    },
                    {
                      key: 'products',
                      label: '🛍️ Quản lý sản phẩm',
                      children: (
                        <div>
                          <div style={{ marginBottom: '16px' }}>
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => setIsAddProductModalVisible(true)}
                            >
                              Thêm sản phẩm mới
                            </Button>
                          </div>
                          <Table
                            columns={productsColumns}
                            dataSource={products.map(product => ({ ...product, key: product.id }))}
                            pagination={{ pageSize: 10 }}
                            responsive
                            scroll={{ x: 800 }}
                          />
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            </div>
          </Spin>
        </Content>
      </Layout>

      {/* Add Product Modal */}
      <Modal
        title="Thêm sản phẩm mới"
        visible={isAddProductModalVisible}
        onCancel={() => {
          setIsAddProductModalVisible(false);
          productForm.resetFields();
        }}
        onOk={() => productForm.submit()}
      >
        <Form
          form={productForm}
          onFinish={handleAddProduct}
          layout="vertical"
        >
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input placeholder="VD: MacBook Pro" />
          </Form.Item>
          <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true }]}>
            <Input placeholder="VD: Apple" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Input placeholder="VD: laptop" />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number' }]}>
            <InputNumber placeholder="0" />
          </Form.Item>
          <Form.Item name="originalPrice" label="Giá gốc">
            <InputNumber placeholder="0" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả sản phẩm" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
