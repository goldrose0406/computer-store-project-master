import React from "react";
import "../styles/BrandShowcase.css";

function BrandShowcase({ onBrandClick, selectedBrand }) {

  const brandNames = {
    1: 'Apple',
    2: 'ASUS',
    3: 'Lenovo',
    4: 'MSI',
    5: 'Acer',
    6: 'HP',
    7: 'DELL',
    8: 'LG',
    9: 'GIGABYTE'
  };

  const brands = [
    { id: 1, image: "/images/logobrand/macbook.jpg" },
    { id: 2, image: "/images/logobrand/Asus.jpg" },
    { id: 3, image: "/images/logobrand/Lenovo.jpg" },
    { id: 4, image: "/images/logobrand/MSI.jpg" },
    { id: 5, image: "/images/logobrand/acer.jpg" },
    { id: 6, image: "/images/logobrand/HP.jpg" },
    { id: 7, image: "/images/logobrand/Dell.jpg" },
    { id: 8, image: "/images/logobrand/LG.jpg" },
    { id: 9, image: "/images/logobrand/Gigabyte.jpg" }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "MacBook",
      image: "/images/banner-mac.jpg",
      description: "Thiết kế tinh tế"
    },
    {
      id: 2,
      name: "HP Gaming Victus",
      image: "/images/hp-victus.jpg",
      description: "Giá từ 19.99 Triệu"
    }
  ];

  return (
    <div className="brand-showcase">

      <div className="featured-section">
        <h2>Mục nổi bật</h2>
        <p className="subtitle">
          Các sản phẩm đặc biệt được ưu đãi lớn lên tới 40 Triệu
        </p>

        <div className="featured-products">
          {featuredProducts.map(product => (
            <div key={product.id} className="featured-card">

              <div className="featured-image">
                <img src={product.image} alt={product.name} />
              </div>

              <h3>{product.name}</h3>
              <p>{product.description}</p>

            </div>
          ))}
        </div>
      </div>

      <div className="brands-section">
        <h3>Máy tính laptop</h3>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className={`brand-card ${selectedBrand === brandNames[brand.id] ? 'active' : ''}`}
              onClick={() => onBrandClick && onBrandClick(brandNames[brand.id])}
              style={{ cursor: 'pointer' }}
            >
              {brand.image ? (
                <img 
                  src={brand.image} 
                  alt={brandNames[brand.id]}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="brand-fallback">
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default BrandShowcase;