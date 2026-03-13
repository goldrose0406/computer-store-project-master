import React, { useState } from 'react';
import { Layout, Row, Col, Card, Table, Button, Space, Statistic, Tabs, Modal, Form, Input, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar';
import { mockOrders, mockProducts } from '../data/mockData';
import '../styles/AdminDashboard.css';

const { Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Orders Table Columns
  const ordersColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'Delivered') color = 'green';
        else if (status === 'Cancelled') color = 'red';
        else if (status === 'Processing') color = 'orange';
        return <span style={{ color, fontWeight: 'bold' }}>{status}</span>;
      }
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small">Xem</Button>
          <Button danger size="small">Xóa</Button>
        </Space>
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `⭐ ${rating}`
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" size="small">Sửa</Button>
          <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
        </Space>
      )
    }
  ];

  const handleAddProduct = (values) => {
    message.success('Thêm sản phẩm thành công!');
    setIsAddProductModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
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
                    value={mockOrders.length}
                    valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Sản phẩm"
                    value={mockProducts.length}
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Doanh thu"
                    value={mockOrders.reduce((acc, order) => acc + order.amount, 0)}
                    valueStyle={{ color: '#faad14', fontSize: '24px' }}
                    formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    suffix="₫"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Khách hàng"
                    value={new Set(mockOrders.map(o => o.customerName)).size}
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
                          dataSource={mockOrders.map(order => ({ ...order, key: order.id }))}
                          pagination={{ pageSize: 5 }}
                          responsive
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
                          dataSource={mockProducts.map(product => ({ ...product, key: product.id }))}
                          pagination={{ pageSize: 5 }}
                          responsive
                        />
                      </div>
                    )
                  },
                  {
                    key: 'users',
                    label: '👥 Quản lý khách hàng',
                    children: (
                      <div>
                        <p>Danh sách khách hàng sẽ được hiển thị ở đây</p>
                        <Table
                          columns={[
                            { title: 'Tên', dataIndex: 'name', key: 'name' },
                            { title: 'Email', dataIndex: 'email', key: 'email' },
                            { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' }
                          ]}
                          dataSource={[]}
                          pagination={false}
                        />
                      </div>
                    )
                  },
                  {
                    key: 'analytics',
                    label: '📈 Thống kê',
                    children: (
                      <div>
                        <Row gutter={[24, 24]}>
                          <Col xs={24} md={12}>
                            <Card title="Doanh thu theo tháng">
                              <p>Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
                            </Card>
                          </Col>
                          <Col xs={24} md={12}>
                            <Card title="Sản phẩm bán chạy">
                              <p>Danh sách sản phẩm bán chạy sẽ được hiển thị ở đây</p>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    )
                  }
                ]}
              />
            </Card>

            {/* Add Product Modal */}
            <Modal
              title="Thêm sản phẩm mới"
              open={isAddProductModalVisible}
              onOk={() => form.submit()}
              onCancel={() => {
                setIsAddProductModalVisible(false);
                form.resetFields();
              }}
            >
              <Form form={form} onFinish={handleAddProduct} layout="vertical">
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true }]}>
                  <Select options={[
                    { label: 'Macbook', value: 'Macbook' },
                    { label: 'Asus', value: 'Asus' },
                    { label: 'Lenovo', value: 'Lenovo' },
                    { label: 'Acer', value: 'Acer' },
                    { label: 'MSI', value: 'MSI' }
                  ]} />
                </Form.Item>
                <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                  <Select options={[
                    { label: 'Laptop', value: 'laptop' },
                    { label: 'Desktop', value: 'desktop' },
                    { label: 'Gaming', value: 'gaming' }
                  ]} />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
