import React from 'react';
import '../styles/CategoryFilter.css';

function CategoryFilter({ onCategoryClick, selectedCategory }) {
  const categories = [
    { id: 1, name: 'Văn phòng', image: '/images/vanphong.jpg' },
    { id: 2, name: 'Mỏng nhẹ', image: '/images/mongnhe.jpg' },
    { id: 3, name: 'Gaming', image: '/images/gaming.jpg' },
    { id: 4, name: 'Sinh viên', image: '/images/sinhvien.jpg' },
    { id: 5, name: 'Đồ họa', image: '/images/dohoa.jpg' },
    { id: 6, name: 'Laptop AI', image: '/images/AI.jpg' }
  ];

  return (
    <div className="category-filter">
      <h2>Chọn theo nhu cầu</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => onCategoryClick && onCategoryClick(cat.name)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-image">
              <img 
                src={cat.image} 
                alt={cat.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
