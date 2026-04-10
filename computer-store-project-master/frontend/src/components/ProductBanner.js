import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import '../styles/ProductBanner.css';

const ProductBanner = ({
  badge = 'Nhóm 10 Store',
  title = 'Build PC Giá Tốt Tối Ưu Hiệu Năng',
  description = 'Tại Computer Store, chúng tôi luôn cố gắng đưa ra cấu hình hợp lý, dễ chọn và đúng với nhu cầu thực tế của bạn.',
  highlights = [
    'Hiệu năng tối ưu theo nhu cầu',
    'Giá cạnh tranh, cấu hình hợp lý',
    'Chất lượng tốt, bảo hành đầy đủ'
  ],
  ctaLabel = 'Xem Sản Phẩm'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      id: 1,
      title: 'PC GAMING GMN-A-5403B',
      specs: 'i5 14400F - RTX 5060',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/I5-14400F-5060-Broll.mp4'
    },
    {
      id: 2,
      title: 'HI-END PC',
      specs: 'I7 14700K RTX 5070Ti',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/LIANLI-O11-VISION-COMPACT-intro.mp4'
    },
    {
      id: 3,
      title: 'HI-END PC',
      specs: '9800X3D RTX 5080',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/PHANTEK-intro.mp4'
    },
    {
      id: 4,
      title: 'PC JONSBO D32 PRO',
      specs: 'I5 14400F RTX 5060',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/JONSBO-D32-PRO-intro.mp4'
    },
    {
      id: 5,
      title: 'PC MONTECH K95',
      specs: 'I7-14700K RTX 4070Ti',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/King-95-Pro-White-intro.mp4'
    },
    {
      id: 6,
      title: 'PC AORUS C400',
      specs: 'R9 9900X RTX 5080',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/PC-FULL-AORUS-intro.mp4'
    }
  ];

  const getDisplayItems = () => {
    const items = [];
    for (let i = 0; i < 3; i += 1) {
      items.push(carouselItems[(currentSlide + i) % carouselItems.length]);
    }
    return items;
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="product-banner-section" style={{ position: 'relative', minHeight: '750px' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        <iframe
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200%',
            height: '200%',
            border: 'none',
            pointerEvents: 'none'
          }}
          src="https://www.youtube.com/embed/-LA-mYbvFFg?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&mute=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title="Computer Store banner"
          allowFullScreen
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.98) 0%, rgba(5, 5, 5, 0.95) 40%, rgba(0, 0, 0, 0.9) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div
        className="banner-content-wrapper"
        style={{ position: 'relative', zIndex: 2, height: '100%', minHeight: '750px', display: 'flex', alignItems: 'center' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="banner-content">
                <div
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    marginBottom: '24px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                >
                  {badge}
                </div>

                <h1
                  style={{
                    fontSize: '35px',
                    fontWeight: 'bold',
                    margin: '0 0 24px 0',
                    lineHeight: '1.2',
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {title}
                </h1>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    maxWidth: '550px'
                  }}
                >
                  {description}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '24px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      <img
                        src="https://pc79.vn/wp-content/uploads/2025/06/crystal-15x15.png"
                        alt="check"
                        style={{ width: '15px', height: '15px' }}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '2px solid #fff',
                    padding: '12px 32px',
                    fontSize: '16px',
                    height: 'auto',
                    borderRadius: '10px',
                    marginTop: '24px',
                    fontWeight: '600'
                  }}
                  href="#products-list"
                >
                  {ctaLabel} <RightOutlined />
                </Button>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="hero-carousel" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  {[0, 1, 2].map((index) => {
                    const current = getDisplayItems()[index];
                    const widths = ['22%', '45%', '28%'];
                    const heights = ['320px', '380px', '350px'];
                    const fontSizes = ['11px', '14px', '12px'];

                    return (
                      <div
                        key={current.id}
                        style={{
                          flex: `0 0 ${widths[index]}`,
                          height: heights[index],
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#1a1f3a',
                          position: 'relative',
                          opacity: index === 1 ? 1 : 0.8,
                          border: index === 1 ? '2px solid #ec4899' : 'none'
                        }}
                      >
                        <video
                          src={current.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                            padding: index === 1 ? '16px 12px' : '12px 8px',
                            color: '#fff'
                          }}
                        >
                          <p style={{ fontSize: fontSizes[index], margin: '0 0 4px 0', fontWeight: 'bold' }}>
                            {current.title}
                          </p>
                          <p style={{ fontSize: '10px', margin: 0, color: '#ccc' }}>{current.specs}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={prevSlide}
                  style={{
                    position: 'absolute',
                    left: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                >
                  <LeftOutlined />
                </button>

                <button
                  onClick={nextSlide}
                  style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                >
                  <RightOutlined />
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                  {carouselItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: 'none',
                        background: idx === currentSlide ? '#ec4899' : '#555',
                        cursor: 'pointer',
                        transition: '0.3s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
