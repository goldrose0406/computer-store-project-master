import React, { useContext } from 'react';
import { Card, Button, Badge, Rate, Tag, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-image-container" onClick={handleProductClick}>
          <img
            alt={product.name}
            src={product.image || 'https://via.placeholder.com/250x250?text=' + product.name}
            className="product-image"
          />
          {discount > 0 && (
            <Badge
              count={`-${discount}%`}
              style={{ backgroundColor: '#ff4d4f', fontSize: '12px' }}
              className="discount-badge"
            />
          )}
        </div>
      }
      onClick={handleProductClick}
      style={{ borderRadius: '8px', overflow: 'hidden' }}
    >
      <div className="product-info">
        {/* Brand Tag */}
        <Tag color="blue" style={{ marginBottom: '8px' }}>
          {product.brand}
        </Tag>

        {/* Product Name */}
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-rating" style={{ marginBottom: '8px' }}>
          <Rate value={product.rating} disabled allowHalf style={{ fontSize: '12px' }} />
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#999' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="product-price" style={{ marginBottom: '12px' }}>
          <span className="current-price" style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
            {product.price.toLocaleString('vi-VN')} ₫
          </span>
          <br />
          <span className="original-price" style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
            {product.originalPrice.toLocaleString('vi-VN')} ₫
          </span>
        </div>

        {/* Quick Specs */}
        <div className="product-specs" style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          <p>💻 {product.specs?.cpu}</p>
          <p>💾 RAM: {product.specs?.ram}</p>
        </div>

        {/* Action Buttons */}
        <div className="product-actions" style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            block
            style={{ flex: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
            }}
          >
            Thêm giỏ
          </Button>
          <Button
            type="default"
            icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
