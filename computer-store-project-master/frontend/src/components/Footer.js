import React from 'react';
import { Row, Col, Divider } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, WechatOutlined } from '@ant-design/icons';

const Footer = () => {
  return (
    <div style={{ background: '#f5f5f5', color: '#333' }}>
      {/* Top Section - Showroom Info */}
      <div style={{ background: '#f9f9f9', padding: '40px 0', borderBottom: '3px solid #ba00ff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <Row gutter={[64, 32]}>
            <Col xs={24} md={12}>
              <h3 style={{ color: '#ba00ff', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                ► SHOWROOM Hà Thị Khiêm - HỒ CHÍ MINH
              </h3>
              <p style={{ margin: '8px 0', lineHeight: '1.6' }}>
                <EnvironmentOutlined style={{ marginRight: '8px', color: '#ba00ff' }} />
                Địa chỉ Showroom: 32/21/11 Hà Thị Khiêm, TPHCM
              </p>
              <p style={{ margin: '8px 0', lineHeight: '1.6' }}>
                Làm việc từ 8:30 - 18:00 tất cả các ngày trong tuần.
              </p>
              <p style={{ margin: '8px 0', lineHeight: '1.6', fontWeight: 'bold' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: '#ba00ff' }} />
                Hotline Hỗ Trợ Bán Hàng: <span style={{ color: '#ba00ff' }}>0123.456.789</span>
              </p>
              <p style={{ margin: '8px 0', lineHeight: '1.6', fontWeight: 'bold' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: '#ba00ff' }} />
                Hotline Hỗ Trợ Bảo Hành: <span style={{ color: '#ba00ff' }}>0123.456.789</span>
              </p>
            </Col>
            <Col xs={24} md={12}></Col>
          </Row>
        </div>
      </div>

      {/* Main Footer Section */}
      <div style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <Row gutter={[64, 40]}>
            {/* Left - Logo & Info */}
            <Col xs={24} md={4}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #ba00ff, #7c3aed)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: '16px'
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>Nhóm 10 Store</span>
                </div>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold' }}>Nhóm 10 Store</h4>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                  
                </p>
              </div>

            </Col>

            {/* Danh Mục */}
            <Col xs={24} sm={12} md={4}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '14px' }}>DANH MỤC</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>PC Gaming Cũ</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>PC Linh Kiện PC</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Linh Kiện PC New</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>CPU Cũ</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>VGA Cũ</a>
                </li>
                <li>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>VGA New</a>
                </li>
              </ul>
            </Col>

            {/* Chính Sách */}
            <Col xs={24} sm={12} md={4}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '14px' }}>CHÍNH SÁCH</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Chính sách hỗ trợ trợ cấp</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Chính sách vận chuyển</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Chính sách bảo hành</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Chính sách bảo mật & điều khoản sử dụng</a>
                </li>
              </ul>
            </Col>

            {/* Liên Hệ */}
            <Col xs={24} sm={12} md={4}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '14px' }}>LIÊN HỆ</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Giới Thiệu</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Liên Hệ</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Cửa Hàng</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>Tin Tức</a>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ background: '#2d2d2d', color: '#fff', textAlign: 'center', padding: '20px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        </div>
      </div>
    </div>
  );
};

export default Footer;
