// Test script để verify handleAddProduct logic
// Run này để xem admin form có thực sự submit không

const testAddProduct = async () => {
  const token = localStorage.getItem('token');
  console.log('🔍 Token:', token ? '✅ có' : '❌ không có');
  
  if (!token) {
    console.error('❌ Không có token! Cần login trước.');
    return;
  }

  // Dữ liệu test giống như form submit
  const product = {
    name: 'Test Samsung Monitor',
    brand: 'Samsung',
    category: 'Màn hình',
    price: 5000000,
    originalPrice: 6000000,
    image: 'samsung-monitor.jpg',
    coverImageUrl: 'samsung-monitor.jpg',
    specs: {
      screenSize: '27 inch',
      resolution: '2K',
      refreshRate: '144Hz'
    }
  };

  console.log('\n📤 Đang gửi:', JSON.stringify(product, null, 2));

  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    console.log('\n📊 Response Status:', response.status);
    const data = await response.json();
    console.log('📥 Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ SUCCESS! Sản phẩm được tạo với ID:', data.productId);
    } else {
      console.error('❌ FAILED! Message:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Export để dùng trong console
window.testAddProduct = testAddProduct;
console.log('✅ testAddProduct script loaded. Run testAddProduct() to test.');
