import React, { useState } from 'react';
import { Row, Col, Card, Select, Button, Empty, Pagination, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import '../styles/ProductList.css';

const ProductListPage = () => {
  const [sortBy, setSortBy] = useState('default');
  const [filterBrand, setFilterBrand] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products
  let filtered = mockProducts;
  if (filterBrand !== 'all') {
    filtered = filtered.filter(p => p.brand === filterBrand);
  }

  // Sort products
  let sorted = [...filtered];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sorted.reverse();
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sorted.slice(startIdx, startIdx + itemsPerPage);

  const brands = ['Macbook', 'Asus', 'Lenovo', 'Acer', 'MSI'];

  return (
    <div className="product-list-page" style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>🛍️ Danh sách sản phẩm</h1>
        <p style={{ color: '#666' }}>Tìm laptop hoặc máy tính phù hợp với nhu cầu của bạn</p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '32px', background: '#fafafa' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Sắp xếp</label>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                options={[
                  { label: 'Mặc định', value: 'default' },
                  { label: 'Giá: Thấp đến Cao', value: 'price-asc' },
                  { label: 'Giá: Cao đến Thấp', value: 'price-desc' },
                  { label: 'Đánh giá cao nhất', value: 'rating' },
                  { label: 'Mới nhất', value: 'newest' }
                ]}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Thương hiệu</label>
              <Select
                value={filterBrand}
                onChange={setFilterBrand}
                style={{ width: '100%' }}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  ...brands.map(b => ({ label: b, value: b }))
                ]}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              block
              onClick={() => {
                setSortBy('default');
                setFilterBrand('all');
                setCurrentPage(1);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Results Count */}
      <div style={{ marginBottom: '16px', color: '#666' }}>
        <strong>{sorted.length}</strong> sản phẩm tìm thấy
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            {paginatedProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                total={sorted.length}
                pageSize={itemsPerPage}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <Empty
          description="Không tìm thấy sản phẩm"
          style={{ marginTop: '40px' }}
        />
      )}
    </div>
  );
};

export default ProductListPage;
