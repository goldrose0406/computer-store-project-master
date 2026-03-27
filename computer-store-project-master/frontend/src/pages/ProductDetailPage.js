import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spin, message, Empty, Form, InputNumber } from 'antd';
import { productsService } from '../services/productsService';
import { CartContext } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const result = await productsService.getProductById(id);
      if (result.success) {
        setProduct(result.product);
        const relatedResult = await productsService.getAllProducts({ brand: result.product.brand });
        if (relatedResult.success) {
          setRelatedProducts(relatedResult.products.filter(p => p.id !== parseInt(id)).slice(0, 10));
        }
      } else {
        message.error('Không tìm thấy sản phẩm');
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!product) {
    return (
      <Empty
        description="Không tìm thấy sản phẩm"
        style={{ padding: '40px', textAlign: 'center' }}
      />
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    message.success(`Đã thêm ${quantity} chiếc ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const nextProduct = relatedProducts.length > 0 ? relatedProducts[0] : null;
  const prevProduct = relatedProducts.length > 1 ? relatedProducts[1] : null;

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://x.com/share?url=${window.location.href}`, '_blank');
  };

  return (
    <div className="product-detail-wrapper">
      {/* BREADCRUMBS */}
      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Trang chủ</a>
            <a href="/products" className="breadcrumb-link">Sản Phẩm</a>
            {product.category && <a href={`/products?category=${product.category}`} className="breadcrumb-link">{product.category}</a>}
            <span className="breadcrumb-last">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* PRODUCT NAVIGATION */}
      <section className="product-nav-section">
        <div className="product-nav-container">
          {prevProduct && (
            <div className="nav-item prev-product">
              <button className="nav-btn prev-btn" onClick={() => navigate(`/product/${prevProduct.id}`)}>
                ←
              </button>
              <div className="nav-preview">
                <img src={prevProduct.image} alt={prevProduct.name} className="nav-thumb" />
                <div className="nav-info">
                  <h4>{prevProduct.name}</h4>
                  <span className="price">{prevProduct.price.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>
          )}
          
          <button className="btn-back" onClick={() => navigate('/products')}>
            Back to products
          </button>

          {nextProduct && (
            <div className="nav-item next-product">
              <div className="nav-preview">
                <img src={nextProduct.image} alt={nextProduct.name} className="nav-thumb" />
                <div className="nav-info">
                  <h4>{nextProduct.name}</h4>
                  <span className="price">{nextProduct.price.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
              <button className="nav-btn next-btn" onClick={() => navigate(`/product/${nextProduct.id}`)}>
                →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MAIN PRODUCT SECTION */}
      <section className="product-main-section">
        <Row gutter={[32, 32]}>
          {/* LEFT: GALLERY */}
          <Col xs={24} sm={24} md={10} className="product-gallery-col sticky-col">
            <div className="product-gallery">
              <div className="gallery-main">
                <img 
                  src={product.image || 'https://via.placeholder.com/600x600'} 
                  alt={product.name}
                  className="main-image"
                />
                <div className="product-label">New</div>
              </div>
              <div className="gallery-thumbnails">
                {[product.image, product.image, product.image, product.image].map((img, idx) => (
                  <div key={idx} className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`} onClick={() => setCurrentImageIndex(idx)}>
                    <img src={img || 'https://via.placeholder.com/100x100'} alt={`Thumbnail ${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* CENTER: DETAILS */}
          <Col xs={24} sm={24} md={10} className="product-details-col sticky-col">
            {/* Title */}
            <h1 className="product-title">{product.name}</h1>

            {/* Meta Info */}
            <div className="product-meta"></div>

            {/* Price */}
            <div className="price-section">
              <div className="price">
                <span className="price-amount">
                  {product.price.toLocaleString('vi-VN')}&nbsp;
                  <span className="currency">₫</span>
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-status"></div>

            {/* Promotional Offers */}
            <div className="promotional-offers">
              <p className="promo-title">🎁 <strong style={{color: '#c300ff'}}>ƯU ĐÃI KHI BUILD PC TẠI PC79 STORE</strong></p>
              <ul className="promo-list">
                <li>Voucher giảm 200K khi mua kèm Màn Hình bất kỳ.</li>
                <li>Tặng Combo Bàn Phím – Chuột – Pad Chuột.</li>
                <li>Miễn phí vệ sinh PC trọn đời tại Showroom PC79.</li>
                <li>Miễn phí ship nội thành TP. HCM (quận huyện HCM cũ).</li>
                <li>Hỗ trợ cài đặt windows, drivers, games, phần mềm.</li>
                <li>Trợ giá Thu Cũ Đổi Mới – Nâng Cấp PC Cũ.</li>
              </ul>
            </div>

            {/* Installment Info */}
            <div className="installment-box">
              <div className="installment-icon">📦</div>
              <div className="installment-content">
                <h4>HỖ TRỢ TRẢ GÓP LINH HOẠT - DỄ DÀNG</h4>
                <ul>
                  <li>Qua Thẻ Tín Dụng (MPOS / KBANK)</li>
                  <li>Cty Tài Chính HD SAISON</li>
                </ul>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <Form layout="vertical" className="add-to-cart-form">
              <Form.Item label="Số lượng">
                <div className="quantity-wrapper">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <InputNumber
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={setQuantity}
                    className="qty-input"
                    bordered={false}
                  />
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </Form.Item>
            </Form>

            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                onClick={handleAddToCart}
                className="btn-add-cart"
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleBuyNow}
                className="btn-buy-now"
              >
                Mua Ngay
              </Button>
            </div>

            {/* Contact Buttons */}
            <div className="contact-buttons">
              <a href="https://zalo.me/2807113230385078620" target="_blank" rel="noopener noreferrer" className="contact-btn">
                Liên Hệ Zalo OA
              </a>
              <a href="https://messenger.com/t/110811251984154" target="_blank" rel="noopener noreferrer" className="contact-btn">
                Liên Hệ Fanpage
              </a>
            </div>

            {/* Social Share */}
            <div className="social-share">
              <span>Share: </span>
              <button onClick={shareOnFacebook} className="share-btn facebook">f</button>
              <button onClick={shareOnTwitter} className="share-btn twitter">𝕏</button>
            </div>
          </Col>

          {/* RIGHT: SIDEBAR */}
          <Col xs={24} sm={24} md={4} className="product-sidebar">
            {/* Showroom Info */}
            <div className="showroom-box">
              <h4>📍 SHOWROOM PHẠM VĂN CHIÊU - TP. HỒ CHÍ MINH</h4>
              <div className="showroom-details">
                <p><strong>Địa chỉ Showroom:</strong> 522 Phạm Văn Chiêu, P.An Hội Đông, TPHCM (P16, Gò Vấp Cũ)</p>
                <p>🚘 Có chỗ đậu xe ô tô quay đầu thoáng - đường 2 chiều.</p>
                <p>☎️ Liên hệ với PC79 để giúp Quý khách lựa chọn đúng nhu cầu của mình:</p>
                <ul>
                  <li><a href="tel:0868792992"><strong>Hotline</strong></a> hoặc <a href="https://zalo.me/2807113230385078620"><strong>Zalo OA</strong></a></li>
                  <li>Thứ 2 - CN từ 9:00 AM - 18:00 PM</li>
                </ul>
              </div>
            </div>

            {/* Delivery & Warranty */}
            <div className="delivery-warranty-box">
              <div className="delivery-item">
                <div className="delivery-icon">🏪</div>
                <h5>Nhận máy & kiểm tra trực tiếp tại Showroom PC79 Store</h5>
                <p>Khách có thể đến tận nơi để kiểm tra chất lượng sản phẩm, đảm bảo mọi chức năng hoạt động tốt trước khi thanh toán.</p>
              </div>

              <div className="delivery-item">
                <div className="delivery-icon">🚚</div>
                <h5>Giao hàng trực tiếp tại Tp. Hồ Chí Minh</h5>
                <p>Nhân viên PC79 Store trực tiếp giao máy, lắp đặt tận nơi nội thành Hồ Chí Minh.</p>
                <p><strong>Miễn phí. Thời gian trong vòng 24h.</strong></p>
              </div>

              <div className="delivery-item">
                <div className="delivery-icon">📦</div>
                <h5>Giao COD toàn quốc qua các bên Vận Chuyển uy tín</h5>
                <p>Sản phẩm sẽ được lắp đặt, đóng gói và giao hàng tận nơi qua các nhà Vận chuyển uy tín như Nhất Tín, Viettel Post, Giao Hàng Tiết Kiệm...</p>
                <p><strong>PC79 hỗ trợ đến 45% phí Ship các bên Vận chuyển. Thời gian: 3 - 5 ngày.</strong></p>
              </div>

              <div className="delivery-item">
                <div className="delivery-icon">⭐</div>
                <h5>Bảo hành ít nhất 12 tháng.</h5>
                <a href="https://example.com/warranty" className="detail-link">Xem chi tiết</a>
              </div>

              <div className="delivery-item">
                <div className="delivery-icon">🔄</div>
                <h5>Chính sách 1-đổi-1 nếu lỗi trong 30 ngày.</h5>
                <a href="https://example.com/return" className="detail-link">Xem chi tiết</a>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Sản phẩm liên quan từ {product.brand}</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.slice(0, 4).map(p => (
              <Col xs={12} sm={12} md={6} key={p.id}>
                <div className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
                  <div className="product-card-image">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h4 className="product-card-name">{p.name}</h4>
                  <div className="product-card-price">
                    {p.price.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
