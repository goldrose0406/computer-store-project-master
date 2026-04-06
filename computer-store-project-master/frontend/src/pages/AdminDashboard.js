import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Table, Button, Space, Statistic, Tabs, Modal, Form, Input, InputNumber, Select, message, Spin, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import { productsService } from '../services/productsService';
import { authService } from '../services/authService';
import '../styles/AdminDashboard.css';

const { Content } = Layout;

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();

  // Tải dữ liệu
  useEffect(() => {
    if (user?.isAdmin && token) {
      loadData();
    }
  }, [user, token]);

  // Handle URL-based modal opening
  useEffect(() => {
    if (location.pathname === '/admin/products/add') {
      setEditingProduct(null);
      productForm.resetFields();
      setIsAddProductModalOpen(true);
    }
  }, [location.pathname, productForm]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Tải đơn hàng
      const ordersResult = await ordersService.getAllOrders(token);
      if (ordersResult.success) {
        setOrders(ordersResult.orders);
        
        // Extract unique customers from orders
        const uniqueCustomers = [];
        const customerEmails = new Set();
        
        if (Array.isArray(ordersResult.orders)) {
          ordersResult.orders.forEach(order => {
            if (order.customerEmail && !customerEmails.has(order.customerEmail)) {
              customerEmails.add(order.customerEmail);
              uniqueCustomers.push({
                id: order.userId || order.customerEmail,
                email: order.customerEmail,
                name: order.customerName,
                phone: order.customerPhone,
                address: order.customerAddress,
                createdAt: order.createdAt
              });
            }
          });
        }
        setCustomers(uniqueCustomers);
      }

      // Tải sản phẩm
      const productsResult = await productsService.getAllProducts({});
      if (productsResult.success) {
        setProducts(productsResult.products);
      }

      // Tải tất cả users (khách hàng đã đăng kí)
      const usersResult = await authService.getAllUsers(token);
      if (usersResult.success) {
        setAllUsers(usersResult.users);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    try {
      if (editingProduct) {
        // Update existing product
        const result = await productsService.updateProduct(editingProduct.id, values, token);
        if (result.success) {
          message.success('Cập nhật sản phẩm thành công!');
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
          productForm.resetFields();
          loadData();
          navigate('/admin');
        } else {
          message.error(result.message);
        }
      } else {
        // Create new product
        const result = await productsService.createProduct(values, token);
        if (result.success) {
          message.success('Thêm sản phẩm thành công!');
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
          productForm.resetFields();
          loadData();
          navigate('/admin');
        } else {
          message.error(result.message);
        }
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    productForm.setFieldsValue({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description
    });
    setIsAddProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    productForm.resetFields();
    navigate('/admin');
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

  // Handle Update User Role
  const handleOpenEditRoleModal = (user) => {
    setSelectedUserForRole(user);
    setNewRole(user.role || (user.isAdmin ? 'admin' : 'customer'));
    setIsEditRoleModalOpen(true);
  };

  const handleUpdateUserRole = async () => {
    console.log('🔍 handleUpdateUserRole called');
    console.log('selectedUserForRole:', selectedUserForRole);
    console.log('newRole:', newRole);
    
    if (!selectedUserForRole || !newRole) {
      message.error('Vui lòng chọn role');
      return;
    }

    setUpdatingRole(true);
    try {
      console.log('📡 Sending API request...');
      const url = `http://localhost:5000/api/auth/users/${selectedUserForRole.id}/role`;
      console.log('URL:', url);
      console.log('Token:', token.substring(0, 20) + '...');
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newRole })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        message.error(data.message || 'Cập nhật role thất bại');
        return;
      }

      message.success(`Cập nhật role thành công! User "${selectedUserForRole.name}" giờ là "${newRole}"`);
      setIsEditRoleModalOpen(false);
      setSelectedUserForRole(null);
      setNewRole(null);
      loadData();
    } catch (error) {
      console.error('❌ Error:', error);
      message.error('Lỗi: ' + error.message);
    } finally {
      setUpdatingRole(false);
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
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditProduct(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            size="small" 
            onClick={() => handleDeleteProduct(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: 140
    }
  ];

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;

  // Render different views based on pathname
  const renderContent = () => {
    const pathname = location.pathname;

    // Products list page
    if (pathname === '/admin/products') {
      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>🛍️ Quản lý sản phẩm</h1>
          </div>
          <Card>
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/products/add')}
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
          </Card>
        </div>
      );
    }

    // Orders page
    if (pathname === '/admin/orders') {
      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>📋 Quản lý đơn hàng</h1>
          </div>
          <Card>
            <Table
              columns={ordersColumns}
              dataSource={orders.map(order => ({ ...order, key: order.id }))}
              pagination={{ pageSize: 10 }}
              responsive
              scroll={{ x: 800 }}
            />
          </Card>
        </div>
      );
    }

    // Users/Customers page
    if (pathname === '/admin/users') {
      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>👥 Quản lý khách hàng</h1>
          </div>
          <Card>
            <Table
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: 60
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email'
                },
                {
                  title: 'Tên khách hàng',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: 'Role',
                  dataIndex: 'role',
                  key: 'role',
                  render: (role) => {
                    const roleColors = {
                      'admin': 'red',
                      'staff': 'orange',
                      'customer': 'green'
                    };
                    const roleLabels = {
                      'admin': 'Admin',
                      'staff': 'Staff',
                      'customer': 'Customer'
                    };
                    return (
                      <Tag color={roleColors[role] || 'blue'}>
                        {roleLabels[role] || role}
                      </Tag>
                    );
                  },
                  width: 100
                },
                {
                  title: 'Ngày tạo',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (date) => new Date(date).toLocaleDateString('vi-VN'),
                  width: 120
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleOpenEditRoleModal(record)}
                    >
                      Đổi Role
                    </Button>
                  ),
                  width: 100
                }
              ]}
              dataSource={allUsers.map(user => ({ ...user, key: user.id }))}
              pagination={{ pageSize: 10 }}
              responsive
              scroll={{ x: 800 }}
            />
          </Card>
        </div>
      );
    }

    // Settings page
    if (pathname === '/admin/settings') {
      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>⚙️ Cấu hình</h1>
          </div>
          <Card>
            <p>Tính năng cấu hình sẽ sớm được cập nhật</p>
          </Card>
        </div>
      );
    }

    // Default: Dashboard with tabs
    return (
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
                        onClick={() => {
                          setEditingProduct(null);
                          productForm.resetFields();
                          setIsAddProductModalOpen(true);
                        }}
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
              },
              {
                key: 'customers',
                label: '👥 Quản lý khách hàng',
                children: (
                  <div>
                    <Table
                      columns={[
                        {
                          title: 'ID',
                          dataIndex: 'id',
                          key: 'id',
                          width: 60
                        },
                        {
                          title: 'Email',
                          dataIndex: 'email',
                          key: 'email'
                        },
                        {
                          title: 'Tên khách hàng',
                          dataIndex: 'name',
                          key: 'name'
                        },
                        {
                          title: 'Loại',
                          dataIndex: 'isAdmin',
                          key: 'isAdmin',
                          render: (isAdmin) => (
                            <Tag color={isAdmin ? 'red' : 'green'}>
                              {isAdmin ? 'Admin' : 'Người dùng'}
                            </Tag>
                          ),
                          width: 120
                        },
                        {
                          title: 'Ngày tạo',
                          dataIndex: 'createdAt',
                          key: 'createdAt',
                          render: (date) => new Date(date).toLocaleDateString('vi-VN')
                        }
                      ]}
                      dataSource={allUsers.map(user => ({ ...user, key: user.id }))}
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
    );
  };

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
            {renderContent()}
          </Spin>
        </Content>
      </Layout>

      {/* Add Product Modal */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isAddProductModalOpen}
        onCancel={handleCloseModal}
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

      {/* Edit User Role Modal */}
      <Modal
        title={`Đổi Role - ${selectedUserForRole?.name || ''}`}
        open={isEditRoleModalOpen}
        onCancel={() => {
          setIsEditRoleModalOpen(false);
          setSelectedUserForRole(null);
          setNewRole(null);
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updatingRole}
        onOk={handleUpdateUserRole}
      >
        {selectedUserForRole && (
          <div style={{ marginBottom: '16px' }}>
            <p><strong>Email:</strong> {selectedUserForRole.email}</p>
            <p><strong>Tên:</strong> {selectedUserForRole.name}</p>
            <p><strong>Role hiện tại:</strong> <Tag color={selectedUserForRole.role === 'admin' ? 'red' : selectedUserForRole.role === 'staff' ? 'orange' : 'green'}>{selectedUserForRole.role || 'customer'}</Tag></p>
            <div style={{ marginTop: '16px' }}>
              <label style={{ marginBottom: '8px', display: 'block' }}>
                <strong>Chọn role mới:</strong>
              </label>
              <Select
                value={newRole}
                onChange={(value) => setNewRole(value)}
                options={[
                  { label: '👤 Customer (Khách hàng)', value: 'customer' },
                  { label: '💼 Staff (Nhân viên)', value: 'staff' },
                  { label: '👨‍💼 Admin (Quản trị viên)', value: 'admin' }
                ]}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
