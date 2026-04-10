import React, { useContext } from 'react';
import { Card, Button, Badge, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatProductCategory } from '../utils/productCategories';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const subtitle = [formatProductCategory(product.category), product.brand].filter(Boolean).join(' / ');
  const fallbackImage = `https://via.placeholder.com/640x640/f4f4f5/5b5b66?text=${encodeURIComponent(product.name || 'Product')}`;

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
            src={product.image || fallbackImage}
            className="product-image"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
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
    >
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-subtitle" title={subtitle}>
          {subtitle || 'Danh muc san pham'}
        </div>

        <div className="product-purchase">
          <div className="product-price">
            <div className="current-price">{product.price.toLocaleString('vi-VN')} ₫</div>
            {product.originalPrice > product.price && (
              <div className="original-price">{product.originalPrice.toLocaleString('vi-VN')} ₫</div>
            )}
          </div>

          <div className="product-actions">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              block
              className="product-card-button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
              }}
            >
              Thêm Vào Giỏ Hàng
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
