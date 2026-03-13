import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      {/* Features Section */}
      <div className="footer-features">
        <div className="feature-item">
          <div className="feature-icon">🚚</div>
          <div className="feature-content">
            <h4>CHÍNH SÁCH GIAO HÀNG</h4>
            <p>Nhận hàng và thanh toán tại nhà</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">🔄</div>
          <div className="feature-content">
            <h4>ĐỐI TRẢ ĐỂ ĐĂNG</h4>
            <p>1 đổi 1 trong 7 ngày</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">💵</div>
          <div className="feature-content">
            <h4>GIÁ LUÔN LUÔN RẺ NHẤT</h4>
            <p>Giá cả hợp lý, nhiều ưu đãi tốt</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">👨‍💼</div>
          <div className="feature-content">
            <h4>HỖ TRỢ NHIỆT TÌNH</h4>
            <p>Tư vấn, giải đáp mọi thắc mắc</p>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-column">
          <h5>GIỚI THIỆU THNS</h5>
          <ul>
            <li><a href="#about">Về chúng tôi</a></li>
            <li><a href="#buying-guide">Tư vấn mua hàng</a></li>
            <li><a href="#careers">Tuyển dụng</a></li>
          </ul>
          <div className="social-links">
            <a href="#facebook" className="social-icon">f</a>
            <a href="#youtube" className="social-icon">▶</a>
            <a href="#tiktok" className="social-icon">♪</a>
            <a href="#twitter" className="social-icon">𝕏</a>
            <a href="#google" className="social-icon">G</a>
          </div>
        </div>

        <div className="footer-column">
          <h5>CHÍNH SÁCH CHUNG</h5>
          <ul>
            <li><a href="#warranty">Chính sách bảo mật</a></li>
            <li><a href="#shipping">Chính sách giao nhận, kiếm hàng</a></li>
            <li><a href="#return">Chính sách trả góp</a></li>
            <li><a href="#payment">Chính sách thanh toán</a></li>
            <li><a href="#settlement">Chính sách giải quyết khiếu nại</a></li>
            <li><a href="#notification">Chính sách bảo về thông tin cá nhân</a></li>
            <li><a href="#warranty-policy">Chính sách bảo hành</a></li>
            <li><a href="#return-exchange">Chính sách đổi - trả hàng</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h5>THÔNG TIN KHUYÊN MÃI</h5>
          <ul>
            <li><a href="#news">Tổng hợp khuyên mãi</a></li>
            <li><a href="#tips">Trang tin tức - tư vấn</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h5>HỖ TRỢ KHÁCH HÀNG</h5>
          <p>CSKH: 0931 889 888</p>
          <p>Tổng hợp hotline, phần ảnh.</p>
          <ul>
            <li><a href="#network">Lập đặt phòng net</a></li>
            <li><a href="#mining">Thiết bị Mining</a></li>
            <li><a href="#warranty">Tra cứu bảo hành</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
