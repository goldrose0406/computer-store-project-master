import React from 'react';
import { Row, Col, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import BuildPcShowcase from '../components/BuildPcShowcase';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const brandLogos = [
    {
      id: 1,
      name: 'Kingston',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/kingston-image_2.webp',
      width: 160,
      height: 43
    },
    {
      id: 2,
      name: 'Corsair',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/corsair-image_3.webp',
      width: 160,
      height: 41
    },
    {
      id: 3,
      name: 'ASUS',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/assus-image_5.png',
      width: 108,
      height: 26
    },
    {
      id: 4,
      name: 'HYTE',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/hyte-image_6.png',
      width: 109,
      height: 26
    },
    {
      id: 5,
      name: 'Lexar',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/Lexar-image_1.webp',
      width: 160,
      height: 57
    },
    {
      id: 6,
      name: 'NVIDIA',
      logo: 'https://pc79.vn/wp-content/uploads/2025/11/NVIDIA-logo.png',
      width: 160,
      height: 41
    }
  ];

  const carouselItems = [
    {
      id: 1,
      title: 'PC GAMING GMN-A-5403B',
      specs: 'i5 14400F – RTX 5060',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/I5-14400F-5060-Broll.mp4',
      link: '#'
    },
    {
      id: 2,
      title: 'HI-END PC',
      specs: 'I7 14700K RTX 5070Ti',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/LIANLI-O11-VISION-COMPACT-intro.mp4',
      link: '#'
    },
    {
      id: 3,
      title: 'HI-END PC',
      specs: '9800X3D RTX 5080',
      video: 'https://pc79.vn/wp-content/uploads/2025/09/PHANTEK-intro.mp4',
      link: '#'
    },
    {
      id: 4,
      title: 'PC JONSBO D32 PRO',
      specs: 'I5 14400F RTX 5060',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/JONSBO-D32-PRO-intro.mp4',
      link: '#'
    },
    {
      id: 5,
      title: 'PC MONTECH K95',
      specs: 'I7-14700K RTX 4070Ti',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/King-95-Pro-White-intro.mp4',
      link: '#'
    },
    {
      id: 6,
      title: 'PC AORUS C400',
      specs: 'R9 9900X RTX 5080',
      video: 'https://pc79.vn/wp-content/uploads/2025/06/PC-FULL-AORUS-intro.mp4',
      link: '#'
    }
  ];

  // Autoplay effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Get 3 items to display
  const getDisplayItems = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(carouselItems[(currentSlide + i) % carouselItems.length]);
    }
    return items;
  };

  return (
    <div style={{ color: '#f7f7f7' }}>
      <div className="homepage" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Video Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        opacity: '0.8',
        overflow: 'hidden'
      }}>
        <iframe
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '160%',
            height: '160%',
            border: 'none',
            pointerEvents: 'none'
          }}
          src="https://www.youtube.com/embed/-bjvPkLE6Q8?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&mute=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title="Phanteks Evolv x2 PC Build - PC79 Store"
        ></iframe>
      </div>

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      {/* Main Hero Section */}
      <div className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
          <Row gutter={[64, 32]} align="middle">
            {/* Left Content */}
            <Col xs={24} lg={12}>
              <div className="hero-content">
                {/* Store Badge */}
                <div style={{ 
                  display: 'inline-block', 
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Nhóm 10 Store
                </div>

                {/* Main Heading */}
                <h1 style={{ 
                  fontSize: '56px', 
                  fontWeight: 'bold', 
                  margin: '0 0 24px 0',
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}>
                  PC GAMING & ĐỒ HỌA GIÁ TỐT
                </h1>

                {/* Description */}
                <p style={{ 
                  fontSize: '16px', 
                  color: '#ccc',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                  maxWidth: '500px'
                }}>
                  Chúng tôi chuyên thiết kế và lắp đặt hệ thống máy tính chuyên nghiệp cho Gaming, đồ họa, kỹ thuật và văn phòng doanh nghiệp. Vượt xa giới hạn của việc bán lẻ phần cứng, chúng tôi cung cấp giải pháp trọn gói: Tư vấn tận tâm – Lắp ráp chuyên nghiệp – Kiểm thử nghiêm ngặt – Hậu mãi chu đáo.
                </p>

                <p style={{ 
                  fontSize: '14px', 
                  color: '#aaa',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                  maxWidth: '500px'
                }}>
                  Triết lý của chúng tôi: Giúp khách hàng sở hữu cấu hình mạnh mẽ nhất trong ngân sách, đảm bảo đầu tư đúng chỗ, hiệu năng dẫn đầu.
                </p>

                {/* CTA Button */}
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: '#7c3aed',
                    borderColor: '#7c3aed',
                    padding: '12px 32px',
                    fontSize: '16px',
                    height: 'auto',
                    borderRadius: '4px'
                  }}
                  onClick={() => navigate('/products')}
                >
                  Xem sản phẩm <RightOutlined />
                </Button>
              </div>
            </Col>

            {/* Right Product Carousel */}
            <Col xs={24} lg={12}>
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
                        {getDisplayItems()[2].title.substring(0, 20)}
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
                    background: 'rgba(255,255,255,0.2)',
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
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  ←
                </button>

                <button
                  onClick={nextSlide}
                  style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)',
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
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  →
                </button>

                {/* Pagination Dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  {carouselItems.map((_, idx) => (
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
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* Brands Marquee Section - Inside Hero */}
          <div style={{
            marginTop: '40px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Title and Marquee Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '40px'
            }}>
              {/* Left: Title */}
              <div style={{
                flex: '0 0 auto',
                whiteSpace: 'nowrap'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#fff',
                  lineHeight: '1.4'
                }}>
                  <span>BUILD PC VỚI LINH KIỆN</span>
                  <br />
                  <span style={{ color: '#ff00ff' }}>THƯƠNG HIỆU TỐT NHẤT</span>
                </p>
              </div>

              {/* Right: Marquee Logos */}
              <div style={{
                flex: '1 1 auto',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  animation: 'marquee 30s linear infinite',
                  gap: '40px'
                }}>
                  {/* Original Set */}
                  {brandLogos.map((brand) => (
                    <div
                      key={`original-${brand.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        flex: '0 0 auto',
                        transition: 'opacity 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        style={{
                          maxHeight: '50px',
                          maxWidth: '160px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ))}

                  {/* Duplicate Set for seamless loop */}
                  {brandLogos.map((brand) => (
                    <div
                      key={`duplicate-${brand.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        flex: '0 0 auto',
                        transition: 'opacity 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        style={{
                          maxHeight: '50px',
                          maxWidth: '160px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CSS Marquee Animation */}
          <style>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>
      </div>

      {/* Category Section */}
      <CategorySection />
      <BuildPcShowcase />
    </div>
  );
};

export default HomePage;
