import React, { useState } from 'react';
import { Row, Col } from 'antd';
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
  ctaLabel = 'Xem Sản Phẩm',
  heroImage = '',
  infoBoxes = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasHeroImage = Boolean(heroImage);

  const carouselItems = [
    {
      id: 1,
      title: 'PC GAMING GMN-A-5403B',
      specs: 'i5 14400F – RTX 5060',
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
    for (let i = 0; i < 3; i++) {
      items.push(carouselItems[(currentSlide + i) % carouselItems.length]);
    }
    return items;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="product-banner-section" style={{ position: 'relative', minHeight: '750px' }}>
      {/* YouTube Video Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden'
      }}>
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
          title="Computer Store PC Gaming"
          allowFullScreen
        ></iframe>
      </div>

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.98) 0%, rgba(5, 5, 5, 0.95) 40%, rgba(0, 0, 0, 0.9) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      {/* Banner Content */}
      <div className="banner-content-wrapper" style={{ position: 'relative', zIndex: 2, height: '100%', minHeight: '750px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
          <Row gutter={[48, 32]} align="middle">
            {/* Left Content */}
            <Col xs={24} lg={12}>
              <div className="banner-content">
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  Nhóm 10 Store
                </div>

                <h1 style={{
                  fontSize: '35px',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                  lineHeight: '1.2',
                  color: '#fff',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  Build PC Giá Tốt Tối Ưu Hiệu Năng
                  <br />
                  
                </h1>

                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  maxWidth: '550px'
                }}>
                  Tại Computer Store, chúng tôi hiểu rằng một chiếc máy tính không chỉ cần mạnh – mà còn phải <strong>phù hợp với nhu cầu bạn, ngân sách bạn có, và trải nghiệm bạn mong muốn</strong>.
                </p>

                {/* Features List */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '24px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.95)' }}>
                    <img 
                      src="https://pc79.vn/wp-content/uploads/2025/06/crystal-15x15.png" 
                      alt="check" 
                      style={{ width: '15px', height: '15px' }}
                    />
                    Hiệu năng tối ưu theo nhu cầu
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.95)' }}>
                    <img 
                      src="https://pc79.vn/wp-content/uploads/2025/06/crystal-15x15.png" 
                      alt="check" 
                      style={{ width: '15px', height: '15px' }}
                    />
                    Giá cạnh tranh, cấu hình hợp lý
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.95)' }}>
                    <img 
                      src="https://pc79.vn/wp-content/uploads/2025/06/crystal-15x15.png" 
                      alt="check" 
                      style={{ width: '15px', height: '15px' }}
                    />
                    Chất lượng tốt, bảo hành đầy đủ
                  </li>
                </ul>

                {/* CTA Button */}
                
              </div>
            </Col>

            {/* Right Product Carousel */}
            <Col xs={24} lg={12}>
              {hasHeroImage ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '420px'
                  }}
                >
                  <img
                    src={heroImage}
                    alt="PC Gaming New"
                    style={{
                      width: '100%',
                      maxWidth: '560px',
                      maxHeight: '520px',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 24px 45px rgba(0, 0, 0, 0.45))'
                    }}
                  />
                </div>
              ) : (
                <div className="hero-carousel" style={{ position: 'relative' }}>
                  {/* Carousel Container - 3 Videos */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-end'
                  }}>
                    {/* Left Video - Small */}
                    <div style={{
                      flex: '0 0 22%',
                      height: '320px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#1a1f3a',
                      position: 'relative',
                      opacity: 0.7
                    }}>
                      <video
                        src={getDisplayItems()[0].video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                        padding: '12px 8px',
                        color: '#fff'
                      }}>
                        <p style={{ fontSize: '11px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                          {getDisplayItems()[0].title.substring(0, 20)}
                        </p>
                        <p style={{ fontSize: '10px', margin: 0, color: '#aaa' }}>
                          {getDisplayItems()[0].specs}
                        </p>
                      </div>
                    </div>

                    {/* Center Video - Large (Main) */}
                    <div style={{
                      flex: '0 0 45%',
                      height: '380px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#1a1f3a',
                      position: 'relative',
                      border: '2px solid #ec4899'
                    }}>
                      <video
                        src={getDisplayItems()[1].video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                        padding: '16px 12px',
                        color: '#fff'
                      }}>
                        <p style={{ fontSize: '14px', margin: '0 0 6px 0', fontWeight: 'bold' }}>
                          {getDisplayItems()[1].title}
                        </p>
                        <p style={{ fontSize: '12px', margin: 0, color: '#ccc' }}>
                          {getDisplayItems()[1].specs}
                        </p>
                      </div>
                    </div>

                    {/* Right Video - Medium */}
                    <div style={{
                      flex: '0 0 28%',
                      height: '350px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#1a1f3a',
                      position: 'relative',
                      opacity: 0.8
                    }}>
                      <video
                        src={getDisplayItems()[2].video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                        padding: '12px 8px',
                        color: '#fff'
                      }}>
                        <p style={{ fontSize: '12px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                          {getDisplayItems()[2].title}
                        </p>
                        <p style={{ fontSize: '10px', margin: 0, color: '#aaa' }}>
                          {getDisplayItems()[2].specs}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.4)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.4)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <RightOutlined />
                  </button>

                  {/* Dots Navigation */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '16px'
                  }}>
                    {carouselItems.map((item, idx) => (
                      <button
                        key={idx}
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
              )}
            </Col>
          </Row>

          {hasHeroImage && infoBoxes.length > 0 && (
            <div className="product-banner-info-strip">
              {infoBoxes.map((item, index) => (
                <div className="product-banner-info-card" key={`${item.title}-${index}`}>
                  <p className="product-banner-info-title">{item.title}</p>
                  <p className="product-banner-info-text">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
