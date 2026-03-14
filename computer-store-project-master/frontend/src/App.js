import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            {/* Cart Sidebar */}
            <CartSidebar />

            {/* Navbar */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="/login" element={null} />
              <Route path="/register" element={null} />
              <Route path="/order-success" element={null} />
              <Route path="/my-orders" element={<Navbar />} />
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

                {/* Checkout */}
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Order Success */}
                <Route path="/order-success" element={<OrderSuccessPage />} />

                {/* My Orders */}
                <Route path="/my-orders" element={<MyOrdersPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin Dashboard - Protected */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect không tìm thấy */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Content>

            {/* Footer */}
            <Routes>
              <Route path="/login" element={null} />
              <Route path="/register" element={null} />
              <Route path="/order-success" element={null} />
              <Route path="/my-orders" element={<Footer />} />
              <Route path="/admin/*" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;