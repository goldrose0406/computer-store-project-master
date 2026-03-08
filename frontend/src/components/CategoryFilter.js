import React, { useState } from 'react';
import '../styles/CategoryFilter.css';

function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Văn phòng', icon: '📁' },
    { id: 2, name: 'Gaming', icon: '🎮' },
    { id: 3, name: 'Mỏng nhẹ', icon: '💨' },
    { id: 4, name: 'Đồ họa - Kỹ thuật', icon: '🎨' },
    { id: 5, name: 'Sinh viên', icon: '🎓' },
    { id: 6, name: 'Cầm ứng', icon: '📱' },
    { id: 7, name: 'Laptop AI', icon: '🤖' }
  ];

  return (
    <div className="category-filter">
      <h2>Chọn theo nhu cầu</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <div className="category-icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
