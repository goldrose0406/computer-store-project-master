export const PRODUCT_CATALOGS = {
  laptop: {
    key: 'laptop',
    title: 'Laptop',
    heading: 'Danh sách sản phẩm laptop',
    description: 'Tìm mẫu laptop phù hợp cho học tập, làm việc, sáng tạo và gaming.',
    route: '/products/laptop'
  },
  'pc-gaming-new': {
    key: 'pc-gaming-new',
    title: 'PC Gaming New',
    heading: 'Danh sách PC Gaming New',
    description: 'Các bộ PC gaming mới 100%, cấu hình tối ưu sẵn để bạn tham khảo.',
    route: '/products/pc-gaming-new'
  },
  'pc-gaming-old': {
    key: 'pc-gaming-old',
    title: 'PC Gaming Old',
    heading: 'Danh sách PC Gaming Old',
    description: 'PC gaming đã qua sử dụng, mức giá mềm hơn nhưng vẫn đủ mạnh để chiến game.',
    route: '/products/pc-gaming-old'
  }
};

export const SAMPLE_GAMING_PRODUCTS = [
  {
    id: 'sample-pc-new-1',
    name: 'PC Gaming New RTX 4060',
    brand: 'Nhóm 10 Build',
    category: 'pc-gaming-new',
    price: 26990000,
    originalPrice: 28990000,
    image: '/images/showcase/anh1.webp',
    rating: 4.9,
    reviews: 18,
    description: 'Bộ PC gaming mới hoàn toàn, tối ưu cho Esports, AAA 2K và livestream cơ bản.',
    specs: {
      cpu: 'Intel Core i5-14400F',
      ram: '16GB DDR5 5600MHz',
      storage: 'SSD NVMe 1TB Gen4',
      gpu: 'RTX 4060 8GB',
      mainboard: 'B760M WiFi',
      psu: '650W 80 Plus Bronze'
    }
  },
  {
    id: 'sample-pc-old-1',
    name: 'PC Gaming Old RX 6600',
    brand: 'Nhóm 10 Value',
    category: 'pc-gaming-old',
    price: 14890000,
    originalPrice: 16990000,
    image: '/images/showcase/anh2.webp',
    rating: 4.6,
    reviews: 11,
    description: 'Cấu hình PC gaming cũ được kiểm tra lại kỹ, phù hợp game thủ cần hiệu năng tốt trong tầm giá.',
    specs: {
      cpu: 'AMD Ryzen 5 5600',
      ram: '16GB DDR4 3200MHz',
      storage: 'SSD NVMe 512GB',
      gpu: 'RX 6600 8GB',
      mainboard: 'B550M',
      psu: '550W 80 Plus'
    }
  }
];

export const getCatalogConfig = (catalogKey) =>
  PRODUCT_CATALOGS[catalogKey] || PRODUCT_CATALOGS.laptop;

export const getSampleProductsByCategory = (catalogKey) =>
  SAMPLE_GAMING_PRODUCTS.filter((product) => product.category === catalogKey);

export const getSampleProductById = (id) =>
  SAMPLE_GAMING_PRODUCTS.find((product) => String(product.id) === String(id));
