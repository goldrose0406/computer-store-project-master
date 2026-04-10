import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Table, Button, Space, Statistic, Tabs, Modal, Form, Input, InputNumber, Select, Upload, message, Spin, Tag, Progress } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';
import { productsService } from '../services/productsService';
import { authService } from '../services/authService';
import {
  PRODUCT_CATEGORY_OPTIONS,
  formatProductCategory,
  isProductCategoryMatch,
  normalizeProductCategory
} from '../utils/productCategories';
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
  const [coverImageFileList, setCoverImageFileList] = useState([]);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [galleryImageFileList, setGalleryImageFileList] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  const [activeProductCategory, setActiveProductCategory] = useState(PRODUCT_CATEGORY_OPTIONS[0].value);
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();

  const resetProductModalState = () => {
    productForm.resetFields();
    setCoverImageFileList([]);
    setCoverImagePreview('');
    setGalleryImageFileList([]);
    setGalleryImagePreviews([]);
  };

  const openCreateProductModal = (category = activeProductCategory) => {
    const nextCategory = normalizeProductCategory(category) || PRODUCT_CATEGORY_OPTIONS[0].value;
    setEditingProduct(null);
    setActiveProductCategory(nextCategory);
    resetProductModalState();
    productForm.setFieldsValue({ category: nextCategory });
    setIsAddProductModalOpen(true);
  };

  // Tải dữ liệu
  useEffect(() => {
    if (user?.isAdmin && token) {
      loadData();
    }
  }, [user, token]);

  // Handle URL-based modal opening
  useEffect(() => {
    if (location.pathname === '/admin/products/add') {
      openCreateProductModal(activeProductCategory);
    }
  }, [location.pathname]);

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
      const productsResult = await productsService.getAllProducts({ limit: 'all' });
      if (productsResult.success) {
        setProducts(productsResult.products);
      }

      // Tải tất cả users (khách hàng đã đăng kí)
      const usersResult = await authService.getAllUsers(token);
      if (usersResult.success) {
        setAllUsers(usersResult.users || []);
      } else {
        console.error('Lỗi tải danh sách users:', usersResult.message);
        setAllUsers([]);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu: ' + error.message);
      console.error('Load data error:', error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (values) => {
    let coverImageUrl = coverImagePreview;
    let galleryImageUrls = [...galleryImagePreviews];

    if (coverImageFileList[0]?.originFileObj) {
      const uploadResult = await productsService.uploadProductImage(coverImageFileList[0].originFileObj, token);
      if (!uploadResult.success) {
        message.error(uploadResult.message);
        return;
      }
      coverImageUrl = uploadResult.imageUrl;
    }

    const newGalleryFiles = galleryImageFileList.filter((file) => file.originFileObj);
    if (newGalleryFiles.length > 0) {
      const uploadedGallery = await Promise.all(
        newGalleryFiles.map((file) => productsService.uploadProductImage(file.originFileObj, token))
      );

      const failedUpload = uploadedGallery.find((item) => !item.success);
      if (failedUpload) {
        message.error(failedUpload.message);
        return;
      }

      galleryImageUrls = uploadedGallery.map((item) => item.imageUrl);
    }

    const payload = {
      name: values.name,
      brand: values.brand,
      category: normalizeProductCategory(values.category || activeProductCategory),
      price: values.price,
      originalPrice: values.originalPrice,
      description: values.description,
      image: coverImageUrl || null,
      specs: {
        cpu: values.cpu,
        ram: values.ram,
        storage: values.storage,
        gpu: values.gpu,
        mainboard: values.mainboard,
        psu: values.psu,
        galleryImages: galleryImageUrls
      }
    };

    setActiveProductCategory(payload.category);

    try {
      if (editingProduct) {
        // Update existing product
        const result = await productsService.updateProduct(editingProduct.id, payload, token);
        if (result.success) {
          message.success('Cập nhật sản phẩm thành công!');
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
          resetProductModalState();
          await loadData();
          navigate('/admin/products');
        } else {
          message.error(result.message);
        }
      } else {
        // Create new product
        const result = await productsService.createProduct(payload, token);
        if (result.success) {
          message.success('Thêm sản phẩm thành công!');
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
          resetProductModalState();
          await loadData();
          navigate('/admin/products');
        } else {
          message.error(result.message);
        }
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    const normalizedCategory = normalizeProductCategory(product.category);
    setEditingProduct(product);
    setActiveProductCategory(normalizedCategory);
    productForm.setFieldsValue({
      name: product.name,
      brand: product.brand,
      category: normalizedCategory,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      cpu: product.specs?.cpu,
      ram: product.specs?.ram,
      storage: product.specs?.storage,
      gpu: product.specs?.gpu,
      mainboard: product.specs?.mainboard,
      psu: product.specs?.psu
    });
    setCoverImagePreview(product.image || '');
    setCoverImageFileList([]);
    setGalleryImagePreviews(product.specs?.galleryImages || []);
    setGalleryImageFileList(
      (product.specs?.galleryImages || []).map((url, index) => ({
        uid: `existing-${index}`,
        name: `gallery-${index + 1}.jpg`,
        status: 'done',
        url
      }))
    );
    setIsAddProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    resetProductModalState();
    if (location.pathname === '/admin/products/add') {
      navigate('/admin/products');
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
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 90,
      render: (image, record) => (
        <img
          src={image || 'https://via.placeholder.com/60x60?text=No+Image'}
          alt={record.name}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
        />
      )
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
      key: 'category',
      render: (category) => formatProductCategory(category)
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
  const adminProductCategories = PRODUCT_CATEGORY_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label
  }));

  // Calculate data for charts
  // 1. Revenue by month (Line Chart)
  const getRevenueByMonth = () => {
    const revenueData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getDate()}`;
      revenueData[monthKey] = (revenueData[monthKey] || 0) + (order.totalPrice || 0);
    });

    return Object.entries(revenueData)
      .slice(-15) // Last 15 days
      .map(([month, revenue]) => ({
        name: month,
        revenue: Math.round(revenue)
      }));
  };

  // 2. Brand distribution (Pie Chart)
  const getBrandDistribution = () => {
    const brandData = {};
    
    orders.forEach(order => {
      if (order.products && typeof order.products === 'string') {
        try {
          const productsList = JSON.parse(order.products);
          productsList.forEach(product => {
            const productInfo = products.find(p => p.id === product.id);
            if (productInfo) {
              brandData[productInfo.brand] = (brandData[productInfo.brand] || 0) + (product.quantity || 1);
            }
          });
        } catch (e) {
          // Handle error
        }
      }
    });

    return Object.entries(brandData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([brand, count], index) => ({
        name: brand,
        value: count,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][index % 6]
      }));
  };

  // 3. Top 5 best-selling products (Bar Chart)
  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.products && typeof order.products === 'string') {
        try {
          const productsList = JSON.parse(order.products);
          productsList.forEach(product => {
            const key = product.name || `Product ${product.id}`;
            productSales[key] = (productSales[key] || 0) + (product.quantity || 1);
          });
        } catch (e) {
          // Handle error
        }
      }
    });

    return Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        quantity: quantity
      }));
  };

  const revenueByMonth = getRevenueByMonth();
  const brandData = getBrandDistribution();
  const topProducts = getTopProducts();
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  const renderProductsTable = (category) => {
    const filteredProducts = products.filter((product) => isProductCategoryMatch(product.category, category));

    return (
      <Table
        columns={productsColumns}
        dataSource={filteredProducts.map((product) => ({ ...product, key: product.id }))}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: `Chưa có sản phẩm trong mục ${formatProductCategory(category)}` }}
        responsive
        scroll={{ x: 800 }}
      />
    );
  };

  const renderProductsManager = () => (
    <Card>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openCreateProductModal(activeProductCategory)}
        >
          Thêm sản phẩm vào {formatProductCategory(activeProductCategory)}
        </Button>
      </div>
      <Tabs
        activeKey={activeProductCategory}
        onChange={setActiveProductCategory}
        items={adminProductCategories.map((option) => ({
          key: option.value,
          label: `${option.label} (${products.filter((product) => isProductCategoryMatch(product.category, option.value)).length})`,
          children: renderProductsTable(option.value)
        }))}
      />
    </Card>
  );

  // Render different views based on pathname
  const renderContent = () => {
    const pathname = location.pathname;

    if (pathname === '/admin/products') {
      const handleExportProductsExcel = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/reports/export/products/excel`;
      };

      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>Quan ly san pham</h1>
          </div>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <Button type="default" onClick={handleExportProductsExcel}>
              Xuat Excel
            </Button>
          </div>
          {renderProductsManager()}
        </div>
      );
    }

    // Products list page
    if (pathname === '/admin/products') {
      const handleExportProductsExcel = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/reports/export/products/excel`;
      };

      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>🛍️ Quản lý sản phẩm</h1>
          </div>
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/products/add')}
              >
                Thêm sản phẩm mới
              </Button>
              <Button
                type="default"
                onClick={handleExportProductsExcel}
              >
                📥 Xuất Excel
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
      const handleExportOrdersExcel = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/reports/export/orders/excel`;
      };

      const handleExportOrdersPDF = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/reports/export/orders/pdf`;
      };

      return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '0' }}>📋 Quản lý đơn hàng</h1>
          </div>
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <Button
                type="default"
                onClick={handleExportOrdersExcel}
              >
                📥 Xuất Excel
              </Button>
              <Button
                type="default"
                onClick={handleExportOrdersPDF}
              >
                📄 Xuất PDF
              </Button>
            </div>
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
            {allUsers && Array.isArray(allUsers) && allUsers.length > 0 ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#999', fontSize: '16px' }}>
                  ℹ️ Chưa có tài khoản nào được tạo
                </p>
              </div>
            )}
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

        {/* Charts Section - Simple HTML/CSS based charts */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          {/* Revenue Trend Chart */}
          <Col xs={24} lg={12}>
            <Card title="📈 Xu hướng doanh thu (15 ngày gần nhất)" bordered={false}>
              {revenueByMonth.length > 0 ? (
                <div style={{ padding: '20px 0' }}>
                  {revenueByMonth.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name}</span>
                        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                          {(item.revenue / 1000000).toFixed(1)}M ₫
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '20px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min((item.revenue / totalRevenue) * 100 || 0, 100)}%`,
                          backgroundColor: '#1890ff',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</p>
              )}
            </Card>
          </Col>

          {/* Brand Distribution Chart */}
          <Col xs={24} lg={12}>
            <Card title="🏷️ Tỷ lệ hãng bán chạy" bordered={false}>
              {brandData.length > 0 ? (
                <div style={{ padding: '20px 0' }}>
                  {brandData.map((item, idx) => {
                    const totalBrand = brandData.reduce((sum, b) => sum + b.value, 0);
                    const percentage = ((item.value / totalBrand) * 100).toFixed(1);
                    return (
                      <div key={idx} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
                          <span>{item.name}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '24px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</p>
              )}
            </Card>
          </Col>
        </Row>

        {/* Top Products Bar Chart */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24}>
            <Card title="🔥 Top 5 sản phẩm bán chạy nhất" bordered={false}>
              {topProducts.length > 0 ? (
                <div style={{ padding: '20px 0' }}>
                  {topProducts.map((item, idx) => {
                    const maxQty = Math.max(...topProducts.map(p => p.quantity));
                    const percentage = (item.quantity / maxQty) * 100;
                    return (
                      <div key={idx} style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '13px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
                          <span>#{idx + 1} {item.name}</span>
                          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{item.quantity} sản phẩm</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '28px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
                            transition: 'width 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '8px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {percentage > 10 && `${percentage.toFixed(0)}%`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</p>
              )}
            </Card>
          </Col>
        </Row>
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
                        onClick={() => openCreateProductModal(activeProductCategory)}
                      >
                        Thêm sản phẩm vào {formatProductCategory(activeProductCategory)}
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
                    {allUsers && Array.isArray(allUsers) && allUsers.length > 0 ? (
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
                    ) : (
                      <Card>
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                          ℹ️ Chưa có tài khoản nào được tạo
                        </p>
                      </Card>
                    )}
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
        title={editingProduct ? "Chỉnh sửa sản phẩm" : `Thêm sản phẩm vào ${formatProductCategory(activeProductCategory)}`}
        open={isAddProductModalOpen}
        onCancel={handleCloseModal}
        onOk={() => productForm.submit()}
        width={720}
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
          <Form.Item
            name="category"
            label="Bạn muốn thêm vào product nào?"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm sản phẩm' }]}
          >
            <Select
              placeholder="Chọn nhóm sản phẩm"
              options={PRODUCT_CATEGORY_OPTIONS}
              onChange={setActiveProductCategory}
            />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number' }]}>
            <InputNumber placeholder="0" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="originalPrice" label="Giá gốc">
            <InputNumber placeholder="0" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ảnh bìa sản phẩm">
            <Upload
              accept=".jpg,.jpeg,.png,.webp"
              beforeUpload={() => false}
              maxCount={1}
              fileList={coverImageFileList}
              onChange={({ fileList }) => {
                const nextList = fileList.slice(-1);
                setCoverImageFileList(nextList);
                if (nextList[0]?.originFileObj) {
                  setCoverImagePreview(URL.createObjectURL(nextList[0].originFileObj));
                } else if (!nextList.length && !editingProduct) {
                  setCoverImagePreview('');
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh bìa từ máy</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
              Hỗ trợ file JPG, PNG, WEBP. Dung lượng tối đa 5MB.
            </div>
            {coverImagePreview && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e5e5' }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Ảnh chi tiết sản phẩm tối đa 5 hình">
            <Upload
              accept=".jpg,.jpeg,.png,.webp"
              beforeUpload={() => false}
              maxCount={5}
              multiple
              listType="picture"
              fileList={galleryImageFileList}
              onChange={({ fileList }) => {
                const nextList = fileList.slice(0, 5);
                setGalleryImageFileList(nextList);
                setGalleryImagePreviews(
                  nextList.map((file) => file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')).filter(Boolean)
                );
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn tối đa 5 ảnh chi tiết</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
              Những ảnh này sẽ hiện trong phần chi tiết sản phẩm.
            </div>
            {galleryImagePreviews.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {galleryImagePreviews.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`Gallery Preview ${index + 1}`}
                    style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e5e5' }}
                  />
                ))}
              </div>
            )}
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả sản phẩm" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="cpu" label="CPU">
                <Input placeholder="VD: Intel Core i5-14400F" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gpu" label="GPU">
                <Input placeholder="VD: RTX 4060 8GB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ram" label="RAM">
                <Input placeholder="VD: 16GB DDR5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="storage" label="Ổ cứng">
                <Input placeholder="VD: SSD NVMe 1TB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mainboard" label="Mainboard">
                <Input placeholder="VD: B760M WiFi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="psu" label="Nguồn">
                <Input placeholder="VD: 650W 80 Plus Bronze" />
              </Form.Item>
            </Col>
          </Row>
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
