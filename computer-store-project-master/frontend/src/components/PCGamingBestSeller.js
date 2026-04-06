import React from 'react';
import { Row, Col } from 'antd';
import '../styles/PCGamingBestSeller.css';

const PCGamingBestSeller = () => {

  const bestSellers = [
    {
      id: 1,
      name: 'PC GAMING GMN5407W',
      shortName: 'GMN5407W',
      cpu: 'i5-14600KF',
      gpu: 'RTX 5070 12G',
      ram: '32GB D4',
      image: 'https://pc79.vn/wp-content/uploads/2025/08/DANH-MUC-PC-I-PC-GAMING-GMN5407W-780x1024.png',
      color: '#00D4FF',
    },
    {
      id: 2,
      name: 'PC GAMING GMN5406',
      shortName: 'GMN5406',
      cpu: 'i5-14600KF',
      gpu: 'RTX 5060Ti',
      ram: '32GB D4',
      image: 'https://pc79.vn/wp-content/uploads/2025/08/DANH-MUC-PC-I-PC-GAMING-GMN5406-780x1024.png',
      color: '#9945FF',
    },
    {
      id: 3,
      name: 'MINI PC I5-5405IW',
      
      image: 'https://pc79.vn/wp-content/uploads/2025/08/DANH-MUC-PC-I-MINI-PC-I5-5405IW-780x1024.png',
      color: '#00E5FF',
    },
    {
      id: 4,
      name: 'PC GAMING BEST PRICE GMN-BP-5204',
      shortName: 'GMN-BP-5204',
      cpu: 'i5-12400F',
      gpu: 'RTX 5060Ti',
      ram: '16GB D4',
      image: 'https://pc79.vn/wp-content/uploads/2025/08/DANH-MUC-PC-I-PC-GAMING-BEST-PRICE-GMN-BP-5204-780x1024.png',
      color: '#FF3366',
    }
  ];



  return (
    <div className="pc-gaming-best-seller-section">
      {/* Gradient Background */}
      <div className="gradient-bg"></div>

      {/* Content */}
      <div className="section-content">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '50px',
            fontWeight: 'bold',
            color: '#9945FF',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            PC GAMING BEST SELLER
          </h2>
          <p style={{
            fontSize: '15.3px',
            color: '#fff',
            marginBottom: 0,
            lineHeight: '1.6'
          }}>
            TOP 4 Full Bộ PC Gaming Giá Rẻ Trên Hiệu Năng, Tối Ưu Theo Các Nhu Cầu Sử Dụng Phổ Biến
          </p>
        </div>

        {/* Carousel Container */}
        <div className="carousel-wrapper">
          {/* Carousel Items */}
          <Row gutter={[30, 24]} className="carousel-items" justify="center">
            {bestSellers.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.id}>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="product-card-link">
                  <div className="product-card" style={{ '--neon-color': item.color }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="product-image"
                    />
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PCGamingBestSeller;
