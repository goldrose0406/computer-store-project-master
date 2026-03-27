import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, message, Tabs, Badge } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ProductOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ordersService } from '../services/ordersService';
import { productsService } from '../services/productsService';
import '../styles/AdminDashboard.css';

const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2'];

export default function DashboardReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with real API endpoint
      const mockData = generateMockDashboardData();
      setData(mockData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateMockDashboardData = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      stats: {
        totalRevenue: 187450,
        totalOrders: 542,
        totalProducts: 12,
        totalCustomers: 234,
        revenueGrowth: 12.5,
        ordersGrowth: -3.2,
      },
      revenueByMonth: months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 100) + 20
      })),
      dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 30) + 5
      })),
      orderStatus: {
        pending: 45,
        confirmed: 87,
        shipped: 132,
        delivered: 278
      },
      topProducts: [
        { id: 1, name: 'Laptop Dell XPS 13', sales: 45, revenue: 44955, rating: 4.8 },
        { id: 2, name: 'MacBook Pro 14"', sales: 38, revenue: 57200, rating: 4.9 },
        { id: 3, name: 'Laptop Asus ROG', sales: 32, revenue: 48000, rating: 4.6 },
        { id: 4, name: 'Lenovo ThinkPad', sales: 28, revenue: 25200, rating: 4.5 },
        { id: 5, name: 'MSI Gaming Laptop', sales: 22, revenue: 19800, rating: 4.4 }
      ],
      brandStats: [
        { name: 'Laptop', value: 45 },
        { name: 'Desktop', value: 30 },
        { name: 'Accessories', value: 15 },
        { name: 'Components', value: 10 }
      ]
    };
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Card type="inner" title="❌ Lỗi" extra={error} />;
  }

  if (!data) return null;

  const orderStatusData = [
    { name: 'Pending', value: data.orderStatus.pending, status: 'processing' },
    { name: 'Confirmed', value: data.orderStatus.confirmed, status: 'success' },
    { name: 'Shipped', value: data.orderStatus.shipped, status: 'warning' },
    { name: 'Delivered', value: data.orderStatus.delivered, status: 'success' },
  ];

  const topProductsColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales) => <Badge count={sales} showZero color="#1890ff" />
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => <span>${revenue.toLocaleString()}</span>
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <span>⭐ {rating}</span>
    }
  ];

  return (
    <div className="dashboard-reports">
      <h2>📊 Dashboard & Báo Cáo Tổng Kết</h2>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="💰 Tổng Doanh Thu"
              value={data.stats.totalRevenue}
              prefix="$"
              suffix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="🛒 Tổng Đơn Hàng"
              value={data.stats.totalOrders}
              suffix={<ArrowDownOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="📦 Sản Phẩm"
              value={data.stats.totalProducts}
              prefix={<ProductOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="👥 Khách Hàng"
              value={data.stats.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Tabs defaultActiveKey="1">
        {/* Revenue Chart */}
        <Tabs.TabPane tab="📈 Doanh Thu" key="1">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="Doanh Thu Hàng Tháng" style={{ marginBottom: '20px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#1890ff" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Doanh Thu Hàng Ngày (30 ngày gần đây)">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#52c41a" name="Daily Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        {/* Orders Status */}
        <Tabs.TabPane tab="🛍️ Trạng Thái Đơn" key="2">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="Phân Bố Trạng Thái Đơn Hàng">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} orders`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Chi Tiết Trạng Thái">
                <div style={{ padding: '20px' }}>
                  {orderStatusData.map((status, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: colors[idx % colors.length], fontWeight: 'bold' }}>
                        ● {status.name}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {status.value} đơn
                      </span>
                      <div style={{
                        width: '100px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(status.value / 542) * 100}%`,
                          height: '20px',
                          backgroundColor: colors[idx % colors.length],
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        {/* Top Products */}
        <Tabs.TabPane tab="⭐ Sản Phẩm Bán Chạy" key="3">
          <Card title="Top 5 Sản Phẩm Bán Chạy Nhất">
            <Table
              dataSource={data.topProducts}
              columns={topProductsColumns}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Card>
        </Tabs.TabPane>

        {/* Category Stats */}
        <Tabs.TabPane tab="📂 Thống Kê Danh Mục" key="4">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="Phân Bố Sản Phẩm Theo Danh Mục">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.brandStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.brandStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Chi Tiết Danh Mục">
                <div style={{ padding: '20px' }}>
                  {data.brandStats.map((category, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: colors[idx % colors.length], fontWeight: 'bold' }}>
                        ● {category.name}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {category.value} sản phẩm
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <div style={{ marginTop: '30px', textAlign: 'right', fontSize: '12px', color: '#999' }}>
        ⏰ Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
      </div>
    </div>
  );
}
