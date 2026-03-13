import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: 'PC Like New',
      description: 'Giá tốt ngoại hình đẹp',
      image: 'https://pc79.vn/wp-content/uploads/2025/06/GRAPHIC-DESIGN-1-300x300.png'
    },
    {
      id: 2,
      title: 'PC New',
      description: 'Hiệu năng tối ưu cho game thủ',
      image: 'https://pc79.vn/wp-content/uploads/2025/06/3D-Visualization-Animation-1-300x300.png'
    },
    {
      id: 3,
      title: 'PC Đồ Hoạ',
      description: 'Chuyên dụng cho thiết kế, 3D',
      image: 'https://pc79.vn/wp-content/uploads/2025/06/AI-ML-DL-LLM-1-300x300.png'
    },
    {
      id: 4,
      title: 'PC ITX',
      description: 'Nhỏ gọn – Tối ưu không gian',
      image: 'https://pc79.vn/wp-content/uploads/2025/06/PC-ITX-300x300.png'
    },
    {
      id: 5,
      title: 'PC Hi-End',
      description: 'Cấu hình khẳng định đẳng cấp',
      image: 'https://pc79.vn/wp-content/uploads/2025/07/PHANTEK-png-1-300x300.png'
    }
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(40, 5, 59, 0.95) 40%, rgba(186, 0, 255, 0.85) 100%)',
        paddingTop: '40px',
        paddingBottom: '40px',
        position: 'relative',
        zIndex: 2,
        color: '#f7f7f7'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fff',
              margin: 0,
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            Danh mục sản phẩm
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#ccc',
              margin: 0
            }}
          >
            Chọn cấu hình phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            gridAutoColumns: 'minmax(200px, 1fr)'
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Category Info */}
              <div style={{ padding: '16px' }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff',
                    margin: '0 0 6px 0'
                  }}
                >
                  {category.title}
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#aaa',
                    margin: '0 0 12px 0',
                    lineHeight: '1.3'
                  }}
                >
                  {category.description}
                </p>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    background: '#7c3aed',
                    borderColor: '#7c3aed',
                    width: '100%',
                    borderRadius: '4px'
                  }}
                  onClick={() => navigate('/products')}
                >
                  Xem chi tiết →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
