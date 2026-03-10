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
    brand,
    specs
  } = product;

  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Check if image is a URL or emoji
  const isImageUrl = image && image.startsWith('/');

  return (
    <div className="product-card">
      {isNew && <div className="new-badge">NEW</div>}
      {discount && <div className="discount-badge">-{discountPercent}%</div>}
      
      <div className="product-image">
        {isImageUrl ? (
          <img 
            src={image} 
            alt={name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.image-fallback').style.display = 'flex';
            }}
          />
        ) : null}
        {!isImageUrl && <div className="image-placeholder">{image}</div>}
        <div className="image-fallback" style={{ display: isImageUrl ? 'none' : 'none' }}>
          {image}
        </div>
      </div>
      
      <div className="product-info">
        <p className="brand">{brand}</p>
        <h3 className="product-name">{name}</h3>
        {specs && <p className="specs">{specs}</p>}
        
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
