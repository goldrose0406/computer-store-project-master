import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  const {
    name,
    price,
    originalPrice,
    reviews,
    image,
    discount,
    isNew,
    brand
  } = product;

  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="product-card">
      {isNew && <div className="new-badge">NEW</div>}
      {discount && <div className="discount-badge">-{discountPercent}%</div>}
      
      <div className="product-image">
        <div className="image-placeholder">{image}</div>
      </div>
      
      <div className="product-info">
        <p className="brand">{brand}</p>
        <h3 className="product-name">{name}</h3>
        
        <div className="rating">
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span className="review-count">({reviews} reviews)</span>
        </div>
        
        <div className="price-section">
          <div className="current-price">{price.toLocaleString('vi-VN')} đ</div>
          {originalPrice && (
            <div className="original-price">{originalPrice.toLocaleString('vi-VN')} đ</div>
          )}
        </div>
        
        <button className="add-to-cart">Thêm vào giỏ</button>
      </div>
    </div>
  );
}

export default ProductCard;
