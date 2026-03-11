import React, { useState } from 'react';
import Header from '../components/Header';
import BrandShowcase from '../components/BrandShowcase';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [products] = useState([
    {
      id: 1,
      name: 'MacBook Air M2 2024',
      brand: 'Apple',
      price: 20190000,
      originalPrice: 23850000,
      rating: 5,
      reviews: 245,
      image: '/images/sanpham/Macbook/M2-2024-16-256.png',
      discount: true,
      isNew: false,
      category: ['Macbook', 'Mỏng nhẹ', 'Sinh viên'],
      specs: '8CPU 8GPU | 16GB | 256GB | 13.6" 2K'
    },
    {
      id: 2,
      name: 'MacBook Air M4 13 inch 2025',
      brand: 'Apple',
      price: 25190000,
      originalPrice: 29640000,
      rating: 5,
      reviews: 156,
      image: '/images/sanpham/Macbook/M4-13-16-256.png',
      discount: true,
      isNew: true,
      category: ['Macbook', 'Mỏng nhẹ', 'Sinh viên'],
      specs: '10CPU 8GPU | 16GB | 256GB | 13.6" 2.5K'
    },
    {
      id: 3,
      name: 'MacBook Pro 14 M5',
      brand: 'Apple',
      price: 41490000,
      originalPrice: 48870000,
      rating: 5,
      reviews: 198,
      image: '/images/sanpham/Macbook/M5-14pro-16-512.png',
      discount: true,
      isNew: false,
      category: ['Macbook', 'Đồ hoạ', 'Thuyết trình'],
      specs: '10CPU 10GPU | 16GB | 512GB | 14.3" 3.5K'
    },
    {
      id: 4,
      name: 'ASUS Vivobook S 14 FLIP',
      brand: 'ASUS',
      price: 19990000,
      originalPrice: 23988000,
      rating: 5,
      reviews: 145,
      image: '/images/sanpham/Asus/s14-flip.png',
      discount: true,
      isNew: true,
      category: ['Mỏng nhẹ', 'Sinh viên', 'Văn phòng'],
      specs: 'i5-13420H | Intel UHD | 16GB | 512GB | 14" WUXGA | Touchscreen'
    },
    {
      id: 5,
      name: 'ASUS TUF Gaming F16',
      brand: 'ASUS',
      price: 22990000,
      originalPrice: 27588000,
      rating: 5,
      reviews: 189,
      image: '/images/sanpham/Asus/tuf-f16.png',
      discount: true,
      isNew: false,
      category: ['Gaming', 'Đồ họa'],
      specs: 'Core i5-210H | RTX 3050 | 16GB | 512GB | 16" WUXGA'
    },
    {
      id: 6,
      name: 'Lenovo LOQ 15IAX9E',
      brand: 'Lenovo',
      price: 22990000,
      originalPrice: 27588000,
      rating: 5,
      reviews: 167,
      image: '/images/sanpham/Lenovo/LOQ-16-512.png',
      discount: true,
      isNew: true,
      category: ['Gaming', 'Đồ họa'],
      specs: 'i7-13650HX | RTX 5060 | 16GB | 512GB | 15.3" WUXGA'
    },
    {
      id: 7,
      name: 'Lenovo Legion 5 15IRX10',
      brand: 'Lenovo',
      price: 41990000,
      originalPrice: 49388000,
      rating: 5,
      reviews: 234,
      image: '/images/sanpham/Lenovo/Legion5-16-512.png',
      discount: true,
      isNew: false,
      category: ['Gaming', 'Đồ họa'],
      specs: 'i5-12450HX | RTX 3050 | 16GB | 512GB | 15.6" Full HD'
    },
    {
      id: 8,
      name: 'Acer Aspire Lite Gen 2 AL14-52M-32KV',
      brand: 'Acer',
      price: 12490000,
      originalPrice: 14694000,
      rating: 5,
      reviews: 98,
      image: '/images/sanpham/Acer/aspire-lite-gen2-8-256.png',
      discount: true,
      isNew: true,
      category: ['Mỏng nhẹ', 'Sinh viên', 'Văn phòng'],
      specs: 'i3-1305U | Intel UHD | 8GB | 256GB | 14.0" WUXGA'
    },
    {
      id: 9,
      name: 'Acer Gaming Aspire 7 A715-59G-57TU',
      brand: 'Acer',
      price: 20990000,
      originalPrice: 24694000,
      rating: 5,
      reviews: 156,
      image: '/images/sanpham/Acer/aspire7-16-512.png',
      discount: true,
      isNew: false,
      category: ['Gaming', 'Đồ họa'],
      specs: 'i5-12450H | RTX 3050 | 16GB | 512GB | 15.6" Full HD'
    },
    {
      id: 10,
      name: 'MSI Prestige 13 AI+ Ukiyoe Edition A2VMG-075VN',
      brand: 'MSI',
      price: 44990000,
      originalPrice: 52588000,
      rating: 5,
      reviews: 124,
      image: '/images/sanpham/MSI/prestige13-ai-32-2T.png',
      discount: true,
      isNew: true,
      category: ['Đồ họa', 'Gaming', 'Laptop AI'],
      specs: 'U9-288V Intel Arc | 32GB | 2TB | 13.3" 2.8K'
    },
    {
      id: 11,
      name: 'MSI Modern 14 F13MG-466VN V2',
      brand: 'MSI',
      price: 17790000,
      originalPrice: 20900000,
      rating: 5,
      reviews: 87,
      image: '/images/sanpham/MSI/modern14-8-512.png',
      discount: true,
      isNew: false,
      category: ['Văn phòng', 'Sinh viên'],
      specs: 'i5-1334U Intel Iris Xe | 8GB | 512GB | 14" Full HD'
    }
  ]);

  // Filter products based on selected brand and category
  const filteredProducts = products.filter(product => {
    const brandMatch = !selectedBrand || product.brand === selectedBrand;
    const categoryMatch = !selectedCategory || (product.category && product.category.includes(selectedCategory));
    return brandMatch && categoryMatch;
  });

  const handleBrandClick = (brand) => {
    setSelectedBrand(selectedBrand === brand ? null : brand);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="home-page">
      <Header />
      <BrandShowcase onBrandClick={handleBrandClick} selectedBrand={selectedBrand} />
      <CategoryFilter onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />
      
      <section className="products-section">
        <div className="section-header">
          <h2>Sản phẩm nổi bật</h2>
          {(selectedBrand || selectedCategory) && (
            <button 
              className="clear-filter"
              onClick={() => {
                setSelectedBrand(null);
                setSelectedCategory(null);
              }}
            >
              Xóa bộ lọc ✕
            </button>
          )}
          <button className="view-all">Xem tất cả →</button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm phù hợp</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;
