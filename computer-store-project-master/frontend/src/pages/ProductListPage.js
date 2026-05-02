import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Select, Button, Empty, Pagination, Spin, message, Input, InputNumber, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { productsService } from '../services/productsService';
import ProductCard from '../components/ProductCard';
import ProductBanner from '../components/ProductBanner';
import PCGamingBestSeller from '../components/PCGamingBestSeller';
import PCGamingOldShowcase from '../components/PCGamingOldShowcase';
import {
  getCatalogConfig,
  getSampleProductsByCategory,
  PRODUCT_CATALOGS
} from '../data/productCatalog';
import { normalizeProductCategory } from '../utils/productCategories';
import '../styles/ProductList.css';

const ProductListPage = () => {
  const navigate = useNavigate();
  const { catalog = 'laptop' } = useParams();
  const catalogConfig = getCatalogConfig(catalog);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filterBrand, setFilterBrand] = useState('all');
  
  // Tạm thời filter (không trigger search)
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');
  const [tempSortBy, setTempSortBy] = useState('default');
  
  // Thực tế filter (trigger search)
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [productPagination, setProductPagination] = useState({ total: 0, page: 1, limit: 15 });

  useEffect(() => {
    if (!PRODUCT_CATALOGS[catalog]) {
      navigate('/products/laptop', { replace: true });
    }
  }, [catalog, navigate]);

  // Hàm áp dụng filter
  const handleApplyFilters = () => {
    setSearchQuery(tempSearchQuery);
    setPriceMin(tempPriceMin);
    setPriceMax(tempPriceMax);
    setSortBy(tempSortBy);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const query = {
        category: catalogConfig.key,
        brand: filterBrand !== 'all' ? filterBrand : undefined,
        search: searchQuery || undefined,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy === 'price-asc' || sortBy === 'price-desc' ? 'price' : undefined,
        sortOrder: sortBy === 'price-asc' ? 'ASC' : sortBy === 'price-desc' ? 'DESC' : undefined
      };

      const result = await productsService.getAllProducts(query);

      if (result.success) {
        const backendProducts = (result.products || []).map((product) => ({
          ...product,
          category: normalizeProductCategory(product.category)
        }));

        const categoryProducts =
          backendProducts.length > 0 ? backendProducts : getSampleProductsByCategory(catalogConfig.key);

        setProducts(categoryProducts);
        setProductPagination(result.pagination || { total: categoryProducts.length, page: currentPage, limit: itemsPerPage });
      } else if (catalogConfig.key === 'laptop') {
        message.error(result.message);
        setProducts([]);
        setProductPagination({ total: 0, page: currentPage, limit: itemsPerPage });
      } else {
        const sampleProducts = getSampleProductsByCategory(catalogConfig.key);
        setProducts(sampleProducts);
        setProductPagination({ total: sampleProducts.length, page: 1, limit: itemsPerPage });
        setCurrentPage(1);
      }

      setLoading(false);
    };

    loadProducts();
  }, [catalogConfig.key, filterBrand, searchQuery, priceMin, priceMax, sortBy, currentPage, itemsPerPage]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))],
    [products]
  );

  const totalPages = Math.ceil(productPagination.total / itemsPerPage);
  const paginatedProducts = products;

  return (
    <div className="product-list-page">
      <ProductBanner
        title={catalogConfig.title === 'Laptop' ? 'Laptop Chính Hãng Dễ Chọn Dễ Mua' : `Cấu Hình ${catalogConfig.title} Tối Ưu Sẵn`}
        description={catalogConfig.description}
        heroImage={
          catalog === 'pc-gaming-new'
            ? 'https://pc79.vn/wp-content/uploads/2024/05/PC-GAMING-CU-PC79.png'
            : ''
        }
        infoBoxes={
          catalog === 'pc-gaming-new'
            ? [
                {
                  title: 'LINH KIỆN CHÍNH HÃNG',
                  description:
                    'Linh kiện PC New & Like New được lựa chọn kỹ càng, sử dụng ổn định và bền bỉ'
                },
                {
                  title: 'NHIỀU ƯU ĐÃI HẤP DẪN',
                  description:
                    'Nhiều CTKM, giảm giá, quà tặng hấp dẫn khi build PC Gaming Like New'
                },
                {
                  title: 'HỖ TRỢ TRẢ GÓP DỄ DÀNG',
                  description:
                    'Thanh toán trả góp linh hoạt qua thẻ tín dụng (MPOS) hoặc cty tài chính HD Saison'
                },
                {
                  title: 'BẢO HÀNH CAM KẾT',
                  description:
                    'Miễn phí 1-đổi-1 trong 30 ngày nếu phát sinh lỗi phần cứng đối với bộ PC Gaming'
                }
              ]
            : []
        }
        highlights={
          catalogConfig.key === 'laptop'
            ? [
                'Mỏng nhẹ, văn phòng, học tập và đồ họa',
                'Nhiều mức giá từ phổ thông đến cao cấp',
                'Bảo hành rõ ràng, dễ nâng cấp và dễ chọn'
              ]
            : [
                'Cấu hình build sẵn dễ tham khảo',
                'Ưu tiên hiệu năng trên giá thành',
                'Có thể nâng cấp theo nhu cầu thực tế'
              ]
        }
      />

      {catalog === 'pc-gaming-new' && <PCGamingBestSeller />}
      {catalog === 'pc-gaming-old' && <PCGamingOldShowcase />}

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }} id="products-list">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>{catalogConfig.heading}</h1>
          <p style={{ color: '#666' }}>{catalogConfig.description}</p>
        </div>

        <Card style={{ marginBottom: '32px', background: '#fafafa' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Tìm kiếm</label>
                <Input
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  placeholder="Tên sản phẩm hoặc mô tả"
                  onPressEnter={handleApplyFilters}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Khoảng giá</label>
                <Space.Compact style={{ width: '100%' }}>
                  <InputNumber
                    placeholder="Min"
                    min={0}
                    style={{ width: '50%' }}
                    value={tempPriceMin}
                    formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => value?.replace(/\./g, '')}
                    onChange={(value) => setTempPriceMin(value)}
                  />
                  <InputNumber
                    placeholder="Max"
                    min={0}
                    style={{ width: '50%' }}
                    value={tempPriceMax}
                    formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => value?.replace(/\./g, '')}
                    onChange={(value) => setTempPriceMax(value)}
                  />
                </Space.Compact>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Thương hiệu</label>
                <Select
                  value={filterBrand}
                  onChange={(value) => {
                    setFilterBrand(value);
                    setCurrentPage(1);
                  }}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    ...brands.map((brand) => ({ label: brand, value: brand }))
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Sắp xếp</label>
                <Select
                  value={tempSortBy}
                  onChange={(value) => {
                    setTempSortBy(value);
                  }}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Mặc định', value: 'default' },
                    { label: 'Giá: Thấp đến cao', value: 'price-asc' },
                    { label: 'Giá: Cao đến thấp', value: 'price-desc' }
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button
                  type="primary"
                  onClick={handleApplyFilters}
                >
                  🔍 Tìm kiếm
                </Button>
                <Button
                  onClick={() => {
                    setTempSearchQuery('');
                    setTempPriceMin('');
                    setTempPriceMax('');
                    setTempSortBy('default');
                    setSearchQuery('');
                    setPriceMin('');
                    setPriceMax('');
                    setFilterBrand('all');
                    setSortBy('default');
                    setCurrentPage(1);
                  }}
                >
                  Đặt lại bộ lọc
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <div style={{ marginBottom: '16px', color: '#666' }}>
          <strong>{productPagination.total}</strong> sản phẩm tìm thấy trong mục{' '}
          <strong>{catalogConfig.title}</strong>
        </div>

        <Spin spinning={loading}>
          {products.length > 0 ? (
            <>
              <div className="product-list-grid" style={{ marginBottom: '32px' }}>
                {products.map((product) => (
                  <div className="product-list-grid__item" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {productPagination.total > itemsPerPage && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Pagination
                    current={currentPage}
                    total={productPagination.total}
                    pageSize={itemsPerPage}
                    onChange={(page, pageSize) => {
                      setCurrentPage(page);
                      setItemsPerPage(pageSize);
                    }}
                    pageSizeOptions={[10, 15, 20, 30]}
                  />
                </div>
              )}
            </>
          ) : (
            <Empty description="Không tìm thấy sản phẩm" style={{ marginTop: '40px' }} />
          )}
        </Spin>

      </div>
    </div>
  );
};

export default ProductListPage;
