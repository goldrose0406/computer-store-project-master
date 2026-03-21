import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Image, Tag, Divider, Form, InputNumber, Spin, message, Empty } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { productsService } from '../services/productsService';
import { CartContext } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Tải sản phẩm từ API
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const result = await productsService.getProductById(id);
      if (result.success) {
        setProduct(result.product);
        // Load related products by brand
        const relatedResult = await productsService.getAllProducts({ brand: result.product.brand });
        if (relatedResult.success) {
          setRelatedProducts(relatedResult.products.filter(p => p.id !== parseInt(id)));
        }
      } else {
        message.error('Không tìm thấy sản phẩm');
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!product) {
    return (
      <Empty
        description="Không tìm thấy sản phẩm"
        style={{ padding: '40px', textAlign: 'center' }}
      />
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    message.success(`Đã thêm ${quantity} chiếc ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
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

            {/* Category */}
            <Tag style={{ marginBottom: '16px' }}>{product.category}</Tag>

            {/* Price */}
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Giá hiện tại</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '8px' }}>
                {product.price.toLocaleString('vi-VN')} ₫
              </div>
              {product.originalPrice > product.price && (
                <div style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                  {product.originalPrice.toLocaleString('vi-VN')} ₫
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <>
                <p style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
                  {product.description}
                </p>
                <Divider />
              </>
            )}

            {/* Specifications */}
            {product.specs && (
              <>
                <h3 style={{ marginBottom: '16px' }}>Thông số kỹ thuật</h3>
                <div style={{ marginBottom: '24px' }}>
                  {Object.entries(JSON.parse(product.specs || '{}')).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span style={{ fontWeight: 'bold', color: '#666' }}>
                        {key === 'cpu' && '🖥️ CPU:'}
                        {key === 'ram' && '💾 RAM:'}
                        {key === 'storage' && '🗄️ Lưu trữ:'}
                        {key === 'display' && '📺 Màn hình:'}
                        {key === 'battery' && '🔋 Pin:'}
                        {!(key === 'cpu' || key === 'ram' || key === 'storage' || key === 'display' || key === 'battery') && `${key}:`}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                <Divider />
              </>
            )}

            {/* Quantity & Actions */}
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
                onClick={() => setIsFavorite(!isFavorite)}
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
              >
                {isFavorite ? 'Yêu thích' : 'Thêm yêu thích'}
              </Button>
            </div>

            {/* Buy Now */}
            <Button
              type="primary"
              danger
              size="large"
              style={{ marginTop: '12px', width: '100%' }}
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
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
