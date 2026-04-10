import React from 'react';
import '../styles/PCGamingOldShowcase.css';

const featuredBuilds = [
  {
    id: 1,
    name: 'PC Gaming Cũ FIZEN I5-5202W',
    image: 'https://pc79.vn/wp-content/uploads/2024/12/PC-Gaming-Cu-FIZEN-I5-5202W.png',
    price: '17.770.000',
    priceNote: 'Cập nhật giá tháng 3/2026',
    
    specs: [
      'CPU INTEL CORE I5-12400F',
      'Mainboard ASUS PRIME H610M-K D4',
      'Ram ADATA XPG D50 DDR4 16GB (8x2) 3200 RGB WHITE',
      'VGA RTX 2060 6GB Used',
      'SSD 250GB M.2 PCIe NVMe',
      'Tản nhiệt khí CENTAUR CT-AIR02 WHITE',
      'Nguồn Xigmatek X-PRO XP650 80Plus Standard',
      'CASE XIGMATEK AQUA M LITE WHITE',
      '(7 FAN SNOWMAN TRẮNG VÔ CỰC)'
    ]
  },
  {
    id: 2,
    name: 'PC Gaming Cũ FIZEN I5-5206W',
    image: 'https://pc79.vn/wp-content/uploads/2024/12/PC-Gaming-Cu-FIZEN-I5-5206W.png',
    price: '20.970.000',
    priceNote: 'Cập nhật giá tháng 3/2026',
    
    specs: [
      'CPU INTEL CORE I5-12400F TRAY',
      'Mainboard ASUS PRIME H610M-K D4',
      'Ram ADATA XPG D50 DDR4 16GB (8x2) 3200 RGB WHITE',
      'VGA RTX 3060Ti 8GB',
      'SSD 500GB M.2 PCIe NVMe',
      'Tản nhiệt khí CENTAUR CT-AIR02 ARGB WHITE',
      'Nguồn Xigmatek X-PRO XP650 80Plus Standard',
      'Case Magic MIX-Tower White',
      '(5 FAN ARGB VÔ CỰC)'
    ]
  },
  {
    id: 3,
    name: 'PC Gaming Cũ GRAZOX I5-5305',
    image: 'https://pc79.vn/wp-content/uploads/2024/12/PC-GAMING-CU-GRAZOX-I5-5305.png',
    price: '27.140.000',
    priceNote: 'Cập nhật giá tháng 3/2026',
    
    specs: [
      'CPU Intel Core I5-13400F TRAY',
      'Mainboard ASUS PRIME B760M-A D4',
      'Ram Adata XPG D50 DDR4 16GB (2x8G) 3200 RGB GREY',
      'VGA RTX 3070 Ti 8GB',
      'SSD 500GB PCIe NVMe',
      'Tản nhiệt nước Xigmatek FENIX 360',
      'Nguồn ASUS TUF GAMING 750W 80Plus Bronze',
      'CASE XIGMATEK PANO M Kính cong',
      '(6 FAN SNOWMAN ĐEN VÔ CỰC)'
    ]
  }
];

const promoImages = [
  {
    id: 1,
    image: 'https://pc79.vn/wp-content/uploads/2024/07/ALienX-TK87-1024x576.jpg',
    alt: 'ALienX TK87',
    
  },
  {
    id: 2,
    image: 'https://pc79.vn/wp-content/uploads/2024/07/LM130S-1024x576.jpg',
    alt: 'LM130S',
    
  },
  {
    id: 3,
    image: 'https://pc79.vn/wp-content/uploads/2024/07/BUILD-PC-giam-200K-khi-mua-kem-man-hinh-1024x576.jpg',
    alt: 'Build PC giảm 200K khi mua kèm màn hình',
    
  },
  {
    id: 4,
    image: 'https://pc79.vn/wp-content/uploads/2024/07/LOt-chuot-80x30cm-1024x576.jpg',
    alt: 'Lót chuột 80x30cm',
    
  }
];

const PCGamingOldShowcase = () => {
  return (
    <section className="pc-gaming-old-showcase">
      <div className="pc-gaming-old-showcase__container">
        <header className="pc-gaming-old-showcase__header">
          <p className="pc-gaming-old-showcase__eyebrow">Best Deal dành cho bạn</p>
          <h2 className="pc-gaming-old-showcase__title">TOP 3 CẤU HÌNH PC GAMING CŨ NỔI BẬT</h2>
          <p className="pc-gaming-old-showcase__description">
            3 cấu hình PC Gaming nổi bật, tối ưu hiệu năng trên giá thành theo 3 phân khúc và nhu
            cầu, được 100+ khách hàng lựa chọn tại Nhóm 10 Store.
          </p>
        </header>

        <div className="pc-gaming-old-showcase__grid">
          {featuredBuilds.map((build) => (
            <article className="old-build-card" key={build.id}>
              <a className="old-build-card__image-link" href={build.href}>
                <img className="old-build-card__image" src={build.image} alt={build.name} />
              </a>

              <div className="old-build-card__panel">
                <div className="old-build-card__pricing">
                  <span className="old-build-card__currency">VNĐ</span>
                  <span className="old-build-card__price">{build.price}</span>
                  <span className="old-build-card__note">{build.priceNote}</span>
                </div>

                <div className="old-build-card__specs">
                  {build.specs.map((spec) => (
                    <div className="old-build-card__spec" key={spec}>
                      {spec}
                    </div>
                  ))}
                </div>

                <div className="old-build-card__footer">
                  <a className="old-build-card__button" href={build.href}>
                    Mua Ngay
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="pc-gaming-old-showcase__promo">
          <header className="pc-gaming-old-showcase__promo-header">
            <p className="pc-gaming-old-showcase__promo-eyebrow">KHI BUILD PC GAMING LIKE NEW TẠI NHÓM 10 STORE</p>
            <h3 className="pc-gaming-old-showcase__promo-title">NHẬN NGAY NHỮNG ƯU ĐÃI HẤP DẪN</h3>
          </header>

          <div className="pc-gaming-old-showcase__promo-grid">
            {promoImages.map((promo) => (
              <a className="promo-image-card" href={promo.href} key={promo.id}>
                <img src={promo.image} alt={promo.alt} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default PCGamingOldShowcase;
