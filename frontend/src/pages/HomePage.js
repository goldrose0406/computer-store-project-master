import React, { useState } from 'react';
import Header from '../components/Header';
import BrandShowcase from '../components/BrandShowcase';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

function HomePage() {
  const [products] = useState([
    {
      id: 1,
      name: 'MacBook Pro M3',
      brand: 'Apple',
      price: 35000000,
      originalPrice: 40000000,
      rating: 5,
      reviews: 245,
      image: '🍎',
      discount: true,
      isNew: false
    },
    {
      id: 2,
      name: 'ASUS VivoBook 15',
      brand: 'ASUS',
      price: 15500000,
      originalPrice: 18000000,
      rating: 5,
      reviews: 156,
      image: '💻',
      discount: true,
      isNew: true
    },
    {
      id: 3,
      name: 'Lenovo ThinkPad X1',
      brand: 'Lenovo',
      price: 25000000,
      originalPrice: 28000000,
      rating: 5,
      reviews: 198,
      image: '🖥️',
      discount: true,
      isNew: false
    },
    {
      id: 4,
      name: 'MSI GF63 Gaming',
      brand: 'MSI',
      price: 22000000,
      originalPrice: 26000000,
      rating: 5,
      reviews: 312,
      image: '🎮',
      discount: true,
      isNew: true
    },
    {
      id: 5,
      name: 'Acer Swift 3',
      brand: 'Acer',
      price: 18000000,
      originalPrice: 21000000,
      rating: 5,
      reviews: 127,
      image: '💨',
      discount: true,
      isNew: false
    },
    {
      id: 6,
      name: 'HP Pavilion 15',
      brand: 'HP',
      price: 16000000,
      originalPrice: 19000000,
      rating: 5,
      reviews: 89,
      image: '✨',
      discount: true,
      isNew: true
    },
    {
      id: 7,
      name: 'DELL XPS 13',
      brand: 'DELL',
      price: 32000000,
      originalPrice: 37000000,
      rating: 5,
      reviews: 267,
      image: '🔥',
      discount: true,
      isNew: false
    },
    {
      id: 8,
      name: 'ASUS ROG Zephyrus',
      brand: 'ASUS',
      price: 38000000,
      originalPrice: 45000000,
      rating: 5,
      reviews: 445,
      image: '🚀',
      discount: true,
      isNew: true
    }
  ]);

  return (
    <div className="home-page">
      <Header />
      <BrandShowcase />
      <CategoryFilter />
      
      <section className="products-section">
        <div className="section-header">
          <h2>Sản phẩm nổi bật</h2>
          <button className="view-all">Xem tất cả →</button>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
