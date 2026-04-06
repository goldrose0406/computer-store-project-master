const nodemailer = require('nodemailer');

// Cấu hình email - sử dụng Gmail
// Để sử dụng Gmail, bạn cần:
// 1. Bật 2-factor authentication
// 2. Tạo App Password tại: https://myaccount.google.com/apppasswords
// 3. Sử dụng App Password thay vì mật khẩu thường

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Hàm gửi mã reset password
const sendResetCode = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: '🔐 Mã Xác Nhận Đặt Lại Mật Khẩu - Computer Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🔐 Đặt Lại Mật Khẩu</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Xin chào! Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Hãy nhập mã xác nhận dưới đây để tiếp tục. <strong style="color: #ec4899;">Mã này sẽ hết hạn trong 15 phút</strong>.
            </p>
            
            <div style="background: white; border: 2px solid #ec4899; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">Mã Xác Nhận:</p>
              <p style="font-size: 36px; font-weight: bold; color: #7c3aed; margin: 0; letter-spacing: 5px;">
                ${resetCode}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              ⚠️ <strong>Lưu ý:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
            
            <div style="background: #f0f0f0; border-left: 4px solid #ec4899; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                <strong>Hướng dẫn an toàn:</strong><br>
                • Đừng chia sẻ mã này với bất kỳ ai<br>
                • Nhân viên Computer Store không bao giờ yêu cầu mã này
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              © 2024 Computer Store. Tất cả quyền được bảo vệ.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

// Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmation = async (email, orderData) => {
  try {
    const { orderId, customerName, products, totalPrice, totalItems } = orderData;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: `🎉 Xác Nhận Đơn Hàng #${orderId} - Computer Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Đơn Hàng Đã Được Xác Nhận</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Xin chào ${customerName}!
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Cảm ơn bạn đã đặt hàng tại Computer Store. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
            
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #7c3aed; margin-top: 0;">Thông Tin Đơn Hàng</h3>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #666;"><strong>Mã Đơn Hàng:</strong></span>
                <span style="color: #7c3aed; font-weight: bold;">#${orderId}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #666;"><strong>Số Lượng Sản Phẩm:</strong></span>
                <span style="color: #333;">${totalItems} item(s)</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                <span style="color: #666;"><strong>Tổng Tiền:</strong></span>
                <span style="color: #ec4899; font-weight: bold; font-size: 18px;">₫${totalPrice.toLocaleString('vi-VN')}</span>
              </div>
              
              <h4 style="color: #333; margin: 20px 0 15px 0;">Sản phẩm trong đơn hàng:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                ${products.map(p => `<li style="margin-bottom: 8px;">${p.name} × ${p.quantity} - ₫${(p.price * p.quantity).toLocaleString('vi-VN')}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background: #e8f5e9; border: 1px solid #4caf50; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #2e7d32; margin: 0;">
                ✅ <strong>Trạng Thái Đơn Hàng:</strong> Đang Xử Lý
              </p>
              <p style="color: #2e7d32; margin: 5px 0 0 0; font-size: 12px;">
                Chúng tôi sẽ liên hệ với bạn sớm để confirm địa chỉ giao hàng.
              </p>
            </div>
            
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #e65100; font-size: 12px; margin: 0;">
                <strong>📞 Hỗ Trợ Khách Hàng:</strong><br>
                Nếu có bất kỳ câu hỏi, vui lòng liên hệ với chúng tôi qua email hoặc điện thoại.
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              © 2024 Computer Store. Tất cả quyền được bảo vệ.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Order confirmation email sent:', info.response);
    return { success: true, message: 'Order confirmation email sent' };
  } catch (error) {
    console.error('❌ Order confirmation email error:', error);
    return { success: false, message: 'Failed to send order confirmation', error: error.message };
  }
};

// Hàm gửi email xác nhận thay đổi mật khẩu
const sendPasswordChangeConfirmation = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: '✅ Mật Khẩu Đã Được Thay Đổi - Computer Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Mật Khẩu Đã Thay Đổi</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Xin chào ${name}!
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Mật khẩu của tài khoản ${email} đã được thay đổi thành công vào lúc <strong>${new Date().toLocaleString('vi-VN')}</strong>.
            </p>
            
            <div style="background: #e8f5e9; border: 1px solid #4caf50; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #2e7d32; margin: 0;">
                ✅ Nếu đây là bạn, bạn có thể bỏ qua email này.
              </p>
            </div>
            
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #e65100; font-size: 12px; margin: 0;">
                <strong>⚠️ Nếu bạn không tự thay đổi mật khẩu:</strong><br>
                Tài khoản của bạn có thể bị hack. Vui lòng liên hệ với bộ phận hỗ trợ ngay lập tức.
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              © 2024 Computer Store. Tất cả quyền được bảo vệ.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Confirmation email sent:', info.response);
    return { success: true };
  } catch (error) {
    console.error('❌ Confirmation email error:', error);
    return { success: false };
  }
};

module.exports = {
  sendResetCode,
  sendPasswordChangeConfirmation,
  sendOrderConfirmation
};
