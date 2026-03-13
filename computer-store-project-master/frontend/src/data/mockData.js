// Mock dữ liệu sản phẩm
export const mockProducts = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    brand: 'Macbook',
    price: 45000000,
    originalPrice: 50000000,
    image: '/images/products/macbook-pro-16.webp',
    rating: 4.8,
    reviews: 250,
    category: 'laptop',
    description: 'MacBook Pro 16 inch với chip Apple M3 Pro, 16GB RAM, SSD 512GB',
    specs: {
      cpu: 'Apple M3 Pro',
      ram: '16GB',
      storage: '512GB SSD',
      display: '16 inch Retina XDR',
      battery: '20+ giờ'
    }
  },
  {
    id: 2,
    name: 'Asus VivoBook 15',
    brand: 'Asus',
    price: 15000000,
    originalPrice: 18000000,
    image: '/images/products/asusvio15.webp',
    rating: 4.5,
    reviews: 180,
    category: 'laptop',
    description: 'Laptop siêu mỏng với AMD Ryzen 7, 8GB RAM, SSD 512GB',
    specs: {
      cpu: 'AMD Ryzen 7 5700U',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      display: '15.6 inch FHD',
      battery: '13 giờ'
    }
  },
  {
    id: 3,
    name: 'Lenovo ThinkBook 14',
    brand: 'Lenovo',
    price: 12000000,
    originalPrice: 14000000,
    image: '/images/products/levovo14.webp',
    rating: 4.6,
    reviews: 95,
    category: 'laptop',
    description: 'Laptop kinh doanh chuyên nghiệp với hiệu suất cao',
    specs: {
      cpu: 'Intel Core i7 12th Gen',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      display: '14 inch FHD',
      battery: '12 giờ'
    }
  },
  {
    id: 4,
    name: 'Acer Aspire 5',
    brand: 'Acer',
    price: 13000000,
    originalPrice: 15000000,
    image: '/images/products/acer5.webp',
    rating: 4.4,
    reviews: 152,
    category: 'laptop',
    description: 'Laptop gaming với GPU NVIDIA và CPU mạnh mẽ',
    specs: {
      cpu: 'Intel Core i5 12th Gen',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      display: '15.6 inch IPS',
      battery: '10 giờ'
    }
  },
  {
    id: 5,
    name: 'MSI GE66 Raider',
    brand: 'MSI',
    price: 28000000,
    originalPrice: 32000000,
    image: '/images/products/msi66.jpg',
    rating: 4.7,
    reviews: 310,
    category: 'laptop',
    description: 'Laptop gaming hiệu suất cao với RTX 4070',
    specs: {
      cpu: 'Intel Core i7 13th Gen',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      display: '15.6 inch 360Hz',
      battery: '4-5 giờ'
    }
  },
  {
    id: 6,
    name: 'MacBook Air M2',
    brand: 'Macbook',
    price: 28000000,
    originalPrice: 32000000,
    image: '/images/products/macairm2.webp',
    rating: 4.7,
    reviews: 420,
    category: 'laptop',
    description: 'MacBook Air M2 mỏng nhẹ, hiệu suất mạnh mẽ',
    specs: {
      cpu: 'Apple M2',
      ram: '8GB',
      storage: '256GB SSD',
      display: '13.6 inch Retina',
      battery: '15+ giờ'
    }
  }
];

// Mock dữ liệu danh mục
export const categories = [
  { id: 1, name: 'Tất cả', key: 'all' },
  { id: 2, name: 'Laptop', key: 'laptop' },
  { id: 3, name: 'Desktop', key: 'desktop' },
  { id: 4, name: 'MacBook', key: 'macbook' }
];

// Mock dữ liệu thương hiệu
export const brands = [
  { id: 1, name: 'Asus', icon: '🔧' },
  { id: 2, name: 'Lenovo', icon: '💼' },
  { id: 3, name: 'Acer', icon: '🎮' },
  { id: 4, name: 'MSI', icon: '⚡' },
  { id: 5, name: 'Macbook', icon: '🍎' }
];

// Mock dữ liệu đơn hàng (cho admin)
export const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    product: 'MacBook Pro 16"',
    amount: 45000000,
    status: 'Delivered',
    date: '2024-03-10',
    quantity: 1
  },
  {
    id: 'ORD-002',
    customerName: 'Trần Thị B',
    email: 'tranthib@email.com',
    product: 'Asus VivoBook 15',
    amount: 15000000,
    status: 'Processing',
    date: '2024-03-12',
    quantity: 1
  },
  {
    id: 'ORD-003',
    customerName: 'Lê Văn C',
    email: 'levanc@email.com',
    product: 'MSI GE66 Raider',
    amount: 28000000,
    status: 'Pending',
    date: '2024-03-13',
    quantity: 1
  }
];
