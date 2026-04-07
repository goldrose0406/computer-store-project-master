import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoginError('');
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        message.success('Login successful!');
        // Đăng nhập thành công - redirect dựa trên vai trò
        if (result.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <Spin spinning={loading}>
        <Card className="auth-card" title="🔐 Đăng Nhập">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="auth-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="your@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            {loginError && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                {loginError}
              </div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="auth-button"
              >
                Đăng Nhập
              </Button>
            </Form.Item>

            <div className="auth-footer">
              <span>Chưa có tài khoản? </span>
              <Link to="/register">Đăng Ký</Link>
            </div>

            <div className="auth-demo" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>📝 Tài khoản Demo:</p>
              <p style={{ fontSize: '12px', margin: '4px 0' }}>👨‍💼 Admin: <code>admin@computerstore.com</code></p>
              <p style={{ fontSize: '12px', margin: '4px 0' }}>🔑 Password: <code>Admin@123</code></p>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default LoginPage;
