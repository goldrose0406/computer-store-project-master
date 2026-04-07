const http = require('http');

// Test function
function testLoginAPI(email, password, description) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ email, password });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`\n${description}`);
          console.log(`  Email: ${email}`);
          console.log(`  Password: ${password}`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  Message: ${response.message}`);
        } catch (e) {
          console.log(`\n${description}`);
          console.log(`  Error: ${data}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n${description}`);
      console.log(`  Error: ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

// Main test
(async () => {
  console.log('🧪 TEST LOGIN API');
  console.log('='.repeat(80));

  // Test 1: Email không tồn tại
  await testLoginAPI('notexist@example.com', 'password123', 
    '✅ Test 1: Email không tồn tại');

  // Test 2: Mật khẩu sai
  await testLoginAPI('admin@computerstore.com', 'wrongpassword',
    '✅ Test 2: Mật khẩu sai');

  // Test 3: Đăng nhập thành công (admin)
  await testLoginAPI('admin@computerstore.com', (process.env.ADMIN_PASSWORD || 'admin123'),
    '✅ Test 3: Đăng nhập thành công (admin)');

  // Test 4: Đăng nhập thành công (Ayda)
  await testLoginAPI('aydaaydo590@gmail.com', 'password123',
    '✅ Test 4: Đăng nhập thành công (Ayda)');

  console.log('\n' + '='.repeat(80));
  console.log('✅ Test hoàn tất!');
})();
