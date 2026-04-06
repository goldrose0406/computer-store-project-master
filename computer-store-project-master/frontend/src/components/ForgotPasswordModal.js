import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Spin, Steps, Space, Statistic } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../styles/AuthPages.css';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: email, 1: verify code, 2: new password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const API_URL = 'http://localhost:5000/api/auth';

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  // Step 1: Request password reset code
  const handleSubmitEmail = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(values.email);
        setCurrentStep(1);
        message.success('Mã xác nhận đã được gửi đến email của bạn!');
      } else {
        message.error(data.message || 'Lỗi khi gửi mã');
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
    setLoading(false);
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          resetCode: values.resetCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResetCode(values.resetCode);
        setCurrentStep(2);
        message.success('Mã xác nhận đúng!');
      } else {
        message.error(data.message || 'Mã xác nhận không đúng');
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          resetCode: resetCode,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Mật khẩu đã được thay đổi thành công!');
        handleClose();
      } else {
        message.error(data.message || 'Lỗi khi đặt lại mật khẩu');
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    }
    setLoading(false);
  };

  // Resend code
  const handleResendCode = async () => {
    setCanResend(false);
    setCountdown(60);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        message.success('Mã xác nhận mới đã được gửi!');
      } else {
        message.error('Lỗi khi gửi lại mã');
        setCanResend(true);
        setCountdown(0);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
      setCanResend(true);
      setCountdown(0);
    }
    setLoading(false);
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    setEmail('');
    setResetCode('');
    setCountdown(0);
    setCanResend(true);
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          🔐 Đặt Lại Mật Khẩu
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={450}
      centered
    >
      <Spin spinning={loading}>
        {/* Steps */}
        <Steps
          current={currentStep}
          items={[
            { title: 'Email' },
            { title: 'Mã Code' },
            { title: 'Mật Khẩu Mới' }
          ]}
          style={{ marginBottom: '30px' }}
        />

        {/* Step 1: Email */}
        {currentStep === 0 && (
          <Form
            form={form}
            name="forgot_password_form"
            onFinish={handleSubmitEmail}
            layout="vertical"
            initialValues={{ email: '' }}
          >
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Nhập email đã đăng ký để nhận mã xác nhận
            </p>

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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
              >
                Gửi Mã Xác Nhận
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 2: Verify Code */}
        {currentStep === 1 && (
          <Form
            form={form}
            name="verify_code_form"
            onFinish={handleVerifyCode}
            layout="vertical"
          >
            <p style={{ color: '#666', marginBottom: '10px' }}>
              Nhập mã xác nhận gồm 6 số được gửi đến
            </p>
            <p style={{ color: '#ec4899', fontWeight: 'bold', marginBottom: '20px' }}>
              {email}
            </p>

            <Form.Item
              label="Mã Xác Nhận"
              name="resetCode"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác nhận' },
                { len: 6, message: 'Mã xác nhận phải gồm 6 số' },
                { pattern: /^\d{6}$/, message: 'Mã xác nhận chỉ chứa số' }
              ]}
            >
              <Input
                placeholder="000000"
                size="large"
                maxLength={6}
                style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
              >
                Xác Nhận Mã
              </Button>
            </Form.Item>

            {/* Resend Code Section */}
            <div style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              {canResend ? (
                <div>
                  <p style={{ color: '#666', margin: '0 0 10px' }}>Không nhận được mã?</p>
                  <Button
                    type="link"
                    style={{ color: '#ec4899', fontWeight: 'bold' }}
                    onClick={handleResendCode}
                    loading={loading}
                  >
                    Gửi Lại Mã Xác Nhận
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#666', margin: '0 0 10px' }}>Gửi lại mã trong:</p>
                  <Statistic.Countdown
                    value={Date.now() + countdown * 1000}
                    format="mm:ss"
                    style={{ fontSize: '20px' }}
                  />
                </div>
              )}
            </div>
          </Form>
        )}

        {/* Step 3: New Password */}
        {currentStep === 2 && (
          <Form
            form={form}
            name="reset_password_form"
            onFinish={handleResetPassword}
            layout="vertical"
          >
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>

            <Form.Item
              label="Mật Khẩu Mới"
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none' }}
              >
                Cập Nhật Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </Modal>
  );
};

export default ForgotPasswordModal;
