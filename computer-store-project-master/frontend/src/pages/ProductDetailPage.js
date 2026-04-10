import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Button, Spin, message, Empty, Form, InputNumber } from 'antd';
import { productsService } from '../services/productsService';
import { CartContext } from '../context/CartContext';
import {
  getCatalogConfig,
  getSampleProductById,
  getSampleProductsByCategory
} from '../data/productCatalog';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      const sampleProduct = getSampleProductById(id);
      if (sampleProduct) {
        setProduct(sampleProduct);
        setRelatedProducts(
          getSampleProductsByCategory(sampleProduct.category).filter((item) => item.id !== sampleProduct.id)
        );
        setLoading(false);
        return;
      }

      if (location.state?.product && String(location.state.product.id) === String(id)) {
        setProduct(location.state.product);
      }

      const result = await productsService.getProductById(id);
      if (result.success) {
        setProduct(result.product);
        const relatedResult = await productsService.getAllProducts({ brand: result.product.brand, limit: 20 });
        if (relatedResult.success) {
          setRelatedProducts(relatedResult.products.filter((p) => String(p.id) !== String(id)).slice(0, 10));
        }
      } else if (!location.state?.product) {
        message.error('Không tìm thấy sản phẩm');
      }

      setLoading(false);
    };

    loadProduct();
  }, [id, location.state]);

  if (loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!product) {
    return <Empty description="Không tìm thấy sản phẩm" style={{ padding: '40px', textAlign: 'center' }} />;
  }

  const catalogConfig = getCatalogConfig(product.category);
  const galleryImages =
    product.specs?.galleryImages && product.specs.galleryImages.length > 0
      ? product.specs.galleryImages
      : [product.image, product.image, product.image, product.image].filter(Boolean);
  const nextProduct = relatedProducts.length > 0 ? relatedProducts[0] : null;
  const prevProduct = relatedProducts.length > 1 ? relatedProducts[1] : null;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    message.success(`Đã thêm ${quantity} chiếc ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://x.com/share?url=${window.location.href}`, '_blank');
  };

  return (
    <div className="product-detail-wrapper">
      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Trang chủ</a>
            <a href={catalogConfig.route} className="breadcrumb-link">Sản phẩm</a>
            <a href={catalogConfig.route} className="breadcrumb-link">{catalogConfig.title}</a>
            <span className="breadcrumb-last">{product.name}</span>
          </nav>
        </div>
      </section>

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

          <button className="btn-back" onClick={() => navigate(catalogConfig.route)}>
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

      <section className="product-main-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8} className="product-gallery-col">
            <div className="product-gallery">
              <div className="gallery-main">
                <img
                  src={galleryImages[currentImageIndex] || product.image || 'https://via.placeholder.com/600x600'}
                  alt={product.name}
                  className="main-image"
                />
                <div className="product-label">New</div>
              </div>
              <div className="gallery-thumbnails">
                {galleryImages.map((img, idx) => (
                  <div
                    key={`${img}-${idx}`}
                    className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img src={img || 'https://via.placeholder.com/100x100'} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={10} className="product-details-col">
            <h1 className="product-title">{product.name}</h1>

            <div className="price-section">
              <div className="price">
                <span className="price-amount">
                  {product.price.toLocaleString('vi-VN')} <span className="currency">₫</span>
                </span>
              </div>
            </div>

            <Form layout="vertical" className="add-to-cart-form">
              <Form.Item label="Số lượng" style={{ marginBottom: '12px' }}>
                <div className="quantity-wrapper">
                  <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    −
                  </button>
                  <InputNumber
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={setQuantity}
                    className="qty-input"
                    bordered={false}
                  />
                  <button type="button" className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </Form.Item>
            </Form>

            <div className="action-buttons">
              <Button type="primary" size="large" onClick={handleAddToCart} className="btn-add-cart">
                Thêm vào giỏ hàng
              </Button>
              <Button type="default" size="large" onClick={handleBuyNow} className="btn-buy-now">
                Mua ngay
              </Button>
            </div>

            <div className="promotional-offers">
              <p className="promo-title">
                <strong style={{ color: '#c300ff' }}>ƯU ĐÃI KHI BUILD PC TẠI NHÓM 10 STORE</strong>
              </p>
              <ul className="promo-list">
                <li>Voucher giảm 200K khi mua kèm màn hình bất kỳ.</li>
                <li>Tặng combo bàn phím, chuột và pad chuột theo từng chương trình.</li>
                <li>Miễn phí vệ sinh PC trọn đời tại showroom.</li>
                <li>Miễn phí cài đặt Windows, driver và phần mềm cơ bản.</li>
              </ul>
            </div>

            <div className="installment-box">
              <div className="installment-icon">📦</div>
              <div className="installment-content">
                <h4>THÔNG SỐ NHANH</h4>
                <ul>
                  {Object.entries(product.specs || {})
                    .filter(([key]) => key !== 'galleryImages')
                    .map(([key, value]) => (
                      <li key={key}>
                        <strong>{key.toUpperCase()}:</strong> {value}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="social-share">
              <span>Share: </span>
              <button onClick={shareOnFacebook} className="share-btn facebook">f</button>
              <button onClick={shareOnTwitter} className="share-btn twitter">𝕏</button>
            </div>
          </Col>

          <Col xs={24} sm={24} md={6} className="product-sidebar">
            <div className="showroom-box">
              <h4>📍 SHOWROOM NHÓM 10 STORE</h4>
              <div className="showroom-details">
                <p><strong>Địa chỉ showroom:</strong> Hà Thị Khiêm 123123</p>
                <p>Liên hệ để được tư vấn cấu hình phù hợp với nhu cầu và ngân sách của bạn.</p>
                <ul>Thứ 2 - CN từ 9:00 AM - 18:00 PM</ul>
              </div>
            </div>

            <div className="delivery-warranty-box">
              <div className="delivery-item">
                <h5>Nhận máy và kiểm tra trực tiếp tại showroom</h5>
                <p>Khách có thể đến tận nơi để kiểm tra sản phẩm trước khi thanh toán.</p>
              </div>

              <div className="delivery-item">
                <h5>Giao hàng trực tiếp tại TP. Hồ Chí Minh</h5>
                <p>Hỗ trợ giao tận nơi và lắp đặt trong nội thành.</p>
              </div>

              <div className="delivery-item">
                <h5>Bảo hành ít nhất 12 tháng</h5>
                <p>Chính sách bảo hành rõ ràng, hỗ trợ kiểm tra nhanh.</p>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Sản phẩm liên quan từ {product.brand}</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.slice(0, 4).map((item) => (
              <Col xs={12} sm={12} md={6} key={item.id}>
                <div className="product-card" onClick={() => navigate(`/product/${item.id}`, { state: { product: item } })}>
                  <div className="product-card-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <h4 className="product-card-name">{item.name}</h4>
                  <div className="product-card-price">{item.price.toLocaleString('vi-VN')} ₫</div>
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
