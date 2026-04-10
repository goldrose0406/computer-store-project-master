import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import LoginModal from './components/LoginModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import './App.css';

const { Content } = Layout;

// Component để render modals (sử dụng useAuth)
function GlobalModals() {
  const { forgotPasswordModalOpen, setForgotPasswordModalOpen } = useAuth();
  return (
    <>
      <LoginModal />
      <ForgotPasswordModal 
        open={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
      />
    </>
  );
}

function AppContent() {
  return (
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
            <Route path="/products" element={<Navigate to="/products/laptop" replace />} />
            <Route path="/products/:catalog" element={<ProductListPage />} />

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

            {/* Staff Dashboard - Protected */}
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <StaffDashboard />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <GlobalModals />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
