import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    setRegisterError('');
    setLoading(true);
    try {
      const result = await register(
        values.name,
        values.email,
        values.password,
        values.confirmPassword
      );
      if (result.success) {
        message.success('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setRegisterError(result.message);
      }
    } catch (error) {
      setRegisterError('Registration failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <Spin spinning={loading}>
        <Card className="auth-card" title="📝 Đăng Ký">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="auth-form"
          >
            <Form.Item
              label="Tên đầy đủ"
              name="name"
              rules={[
                { required: true, message: 'Please enter your full name' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="John Doe"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="your@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            {registerError && (
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
                {registerError}
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
                Đăng Ký
              </Button>
            </Form.Item>

            <div className="auth-footer">
              <span>Đã có tài khoản? </span>
              <Link to="/login">Đăng Nhập</Link>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default RegisterPage;
