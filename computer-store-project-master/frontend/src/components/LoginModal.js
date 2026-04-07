import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const LoginModal = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const { login, register, loginModalOpen, setLoginModalOpen, setForgotPasswordModalOpen } = useAuth();

  // Handle Login
  const onFinishLogin = async (values) => {
    setLoginError('');
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        message.success('Đăng nhập thành công!');
        setLoginModalOpen(false);
        form.resetFields();
        setActiveTab('login');
        setLoginError('');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('Đăng nhập thất bại: ' + error.message);
    }
    setLoading(false);
  };

  // Handle Register
  const onFinishRegister = async (values) => {
    setRegisterError('');
    if (values.password !== values.confirmPassword) {
      setRegisterError('Mật khẩu không trùng khớp!');
      return;
    }

    setLoading(true);
    try {
      const result = await register(values.name, values.email, values.password, values.confirmPassword);
      if (result.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setActiveTab('login');
        form.resetFields();
        setRegisterError('');
      } else {
        setRegisterError(result.message);
      }
    } catch (error) {
      setRegisterError('Đăng ký thất bại: ' + error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setLoginModalOpen(false);
    form.resetFields();
    setLoginError('');
    setRegisterError('');
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          🔐 Tài Khoản Người Dùng
        </div>
      }
      open={loginModalOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={450}
      centered
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'login',
              label: '🔑 Đăng Nhập',
              children: (
                <Form
                  form={form}
                  name="login_form"
                  onFinish={onFinishLogin}
                  layout="vertical"
                  style={{ marginTop: '20px' }}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="your@email.com"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật Khẩu"
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu' }
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

                  <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <span 
                      style={{ color: '#ec4899', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                      onClick={() => {
                        setLoginModalOpen(false);
                        setForgotPasswordModalOpen(true);
                      }}
                    >
                      Quên mật khẩu?
                    </span>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
                    >
                      Đăng Nhập
                    </Button>
                  </Form.Item>

                  <div style={{ 
                    position: 'relative', 
                    textAlign: 'center', 
                    margin: '20px 0',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    <div style={{ background: '#fff', padding: '0 8px', display: 'inline-block' }}>
                      Chưa có tài khoản? <span style={{ color: '#ec4899', cursor: 'pointer' }} onClick={() => setActiveTab('register')}>Đăng Ký Ngay</span>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '20px', 
                    paddingTop: '20px', 
                    borderTop: '1px solid #eee',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>📝 Tài Khoản Demo:</p>
                    <p style={{ margin: '4px 0', color: '#999' }}>👨‍💼 Admin: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>admin@computerstore.com</code></p>
                    <p style={{ margin: '4px 0', color: '#999' }}>🔑 Password: <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>Admin@123</code></p>
                  </div>
                </Form>
              )
            },
            {
              key: 'register',
              label: '✍️ Đăng Ký',
              children: (
                <Form
                  form={form}
                  name="register_form"
                  onFinish={onFinishRegister}
                  layout="vertical"
                  style={{ marginTop: '20px' }}
                >
                  <Form.Item
                    label="Họ và Tên"
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên' },
                      { min: 2, message: 'Tên phải từ 2 ký tự trở lên' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nguyễn Văn A"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="your@email.com"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật Khẩu"
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu' },
                      { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="••••••••"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Xác Nhận Mật Khẩu"
                    name="confirmPassword"
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu' }
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
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
                    >
                      Đăng Ký
                    </Button>
                  </Form.Item>

                  <div style={{ 
                    position: 'relative', 
                    textAlign: 'center', 
                    margin: '20px 0',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    <div style={{ background: '#fff', padding: '0 8px', display: 'inline-block' }}>
                      Đã có tài khoản? <span style={{ color: '#ec4899', cursor: 'pointer' }} onClick={() => setActiveTab('login')}>Đăng Nhập</span>
                    </div>
                  </div>
                </Form>
              )
            }
          ]}
        />
      </Spin>
    </Modal>
  );
};

export default LoginModal;
