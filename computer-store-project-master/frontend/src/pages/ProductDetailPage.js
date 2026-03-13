import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Image, Rate, Tag, Divider, Form, InputNumber, Modal, message, Tabs } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { mockProducts } from '../data/mockData';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = location.state?.product || mockProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Button type="primary" onClick={() => navigate('/products')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const relatedProducts = mockProducts.filter(p => p.id !== product.id && p.brand === product.brand).slice(0, 4);

  const handleAddToCart = () => {
    message.success(`Đã thêm ${quantity} chiếc ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    message.info('Tiến hành thanh toán...');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Button
        type="text"
        onClick={() => navigate('/products')}
        style={{ marginBottom: '24px' }}
        icon={<ArrowLeftOutlined />}
      >
        Quay lại danh sách
      </Button>

      {/* Main Content */}
      <Row gutter={[32, 32]}>
        {/* Left: Images */}
        <Col xs={24} md={12}>
          <Card>
            <Image
              src={product.image || 'https://via.placeholder.com/400x400'}
              alt={product.name}
              width="100%"
              style={{ borderRadius: '8px' }}
            />
            {discount > 0 && (
              <Tag color="red" style={{ marginTop: '16px', fontSize: '18px', padding: '8px 16px' }}>
                Giảm {discount}%
              </Tag>
            )}
          </Card>
        </Col>

        {/* Right: Details */}
        <Col xs={24} md={12}>
          <Card>
            {/* Brand */}
            <Tag color="blue" style={{ marginBottom: '12px' }}>
              {product.brand}
            </Tag>

            {/* Name */}
            <h1 style={{ fontSize: '28px', marginBottom: '16px', marginTop: '0' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ marginBottom: '24px' }}>
              <Rate value={product.rating} disabled allowHalf style={{ marginRight: '12px' }} />
              <span style={{ color: '#666' }}>
                ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Giá hiện tại</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '8px' }}>
                {product.price.toLocaleString('vi-VN')} ₫
              </div>
              <div style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                {product.originalPrice.toLocaleString('vi-VN')} ₫
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Specifications */}
            <Divider>Thông số kỹ thuật</Divider>
            <div style={{ marginBottom: '24px' }}>
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 'bold', color: '#666' }}>
                    {key === 'cpu' && '🖥️ CPU:'}
                    {key === 'ram' && '💾 RAM:'}
                    {key === 'storage' && '🗄️ Lưu trữ:'}
                    {key === 'display' && '📺 Màn hình:'}
                    {key === 'battery' && '🔋 Pin:'}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            <Divider />
            <Form layout="vertical" style={{ marginBottom: '24px' }}>
              <Form.Item label="Số lượng" style={{ marginBottom: '16px' }}>
                <InputNumber
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={setQuantity}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                style={{ flex: 1 }}
              >
                Thêm vào giỏ
              </Button>
              <Button
                type="default"
                size="large"
                icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={() => setIsFavorite(!isFavorite)}
              />
            </div>
            <Button
              type="default"
              size="large"
              block
              style={{ marginTop: '12px' }}
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>

            {/* Additional Info */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#f0f5ff', borderRadius: '8px' }}>
              <div style={{ marginBottom: '8px' }}>✅ Hàng chính hãng 100%</div>
              <div style={{ marginBottom: '8px' }}>✅ Bảo hành 24 tháng</div>
              <div>✅ Giao hàng miễn phí</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2>Sản phẩm liên quan từ {product.brand}</h2>
          <Row gutter={[24, 24]}>
            {relatedProducts.map(p => (
              <Col xs={24} sm={12} md={6} key={p.id}>
                <Card hoverable onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' }} />
                    <h4 style={{ marginBottom: '8px' }}>{p.name}</h4>
                    <div style={{ float: 'left', color: '#ff4d4f', fontWeight: 'bold' }}>
                      {p.price.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
