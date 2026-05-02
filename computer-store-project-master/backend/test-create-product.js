const http = require('http');

// Test login + create product
async function testCreateProduct() {
  try {
    console.log('🧪 TEST LOGIN + CREATE PRODUCT\n');

    // Step 1: Login
    console.log('📝 Step 1: Logging in...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@computerstore.com',
      password: 'Admin@123'
    });

    console.log(`Status: ${loginRes.status}`);
    console.log(`Response: ${JSON.stringify(loginRes.data, null, 2)}\n`);

    if (loginRes.status !== 200) {
      console.log('❌ Login failed!');
      return;
    }

    const token = loginRes.data.token;
    console.log(`✅ Login successful! Token: ${token.substring(0, 50)}...\n`);

    // Step 2: Create Product
    console.log('📝 Step 2: Creating product...');
    const productPayload = {
      name: 'Test Laptop MSI Gaming',
      brand: 'MSI',
      category: 'laptop-gaming',
      price: 25000000,
      originalPrice: 28000000,
      description: 'Test product for verification',
      image: '/images/sanpham/MSI/test.png',
      specs: {
        cpu: 'Intel Core i7-12700H',
        ram: '16GB DDR5',
        storage: '512GB SSD',
        gpu: 'NVIDIA RTX 3070',
        mainboard: 'MSI Z690',
        psu: '650W'
      }
    };

    const createRes = await makeRequest('POST', '/api/products', productPayload, token);

    console.log(`Status: ${createRes.status}`);
    console.log(`Response: ${JSON.stringify(createRes.data, null, 2)}\n`);

    if (createRes.status === 201 || createRes.status === 200) {
      console.log('✅ Product created successfully!');
    } else {
      console.log('❌ Failed to create product');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function makeRequest(method, path, data, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

testCreateProduct();
