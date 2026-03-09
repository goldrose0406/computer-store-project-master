import React from "react";
import "../styles/BrandShowcase.css";

function BrandShowcase() {

  const brands = [
    "MacBook","ASUS","Lenovo","MSI","Acer",
    "HP","DELL","LG","GIGABYTE","Masterbox","SAMSUNG"
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
          {brands.map((brand,index) => (
            <div key={index} className="brand-card">
              {brand}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default BrandShowcase;