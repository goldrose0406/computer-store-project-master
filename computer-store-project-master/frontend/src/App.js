import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Cart Sidebar */}
          <CartSidebar />

          {/* Navbar */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        {/* Main Content */}
        <Content>
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Danh sách sản phẩm */}
            <Route path="/products" element={<ProductListPage />} />

            {/* Chi tiết sản phẩm */}
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* Admin Dashboard */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Redirect không tìm thấy */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>

        {/* Footer */}
        <Footer />
      </Layout>
    </Router>
    </CartProvider>
  );
}

export default App;