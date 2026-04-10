import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Select, Button, Empty, Pagination, Spin, message } from 'antd';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!PRODUCT_CATALOGS[catalog]) {
      navigate('/products/laptop', { replace: true });
    }
  }, [catalog, navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result = await productsService.getAllProducts({ category: catalogConfig.key, limit: 'all' });

      if (result.success) {
        const backendProducts = (result.products || []).map((product) => ({
          ...product,
          category: normalizeProductCategory(product.category)
        }));
        const categoryProducts =
          backendProducts.length > 0 ? backendProducts : getSampleProductsByCategory(catalogConfig.key);
        setProducts(categoryProducts);
        setCurrentPage(1);
      } else if (catalogConfig.key === 'laptop') {
        message.error(result.message);
        setProducts([]);
      } else {
        setProducts(getSampleProductsByCategory(catalogConfig.key));
        setCurrentPage(1);
      }

      setLoading(false);
    };

    loadProducts();
  }, [catalogConfig.key]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (filterBrand !== 'all') {
      list = list.filter((product) => product.brand === filterBrand);
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return list;
  }, [products, filterBrand, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

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
            <Col xs={24} sm={12} md={8}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Sắp xếp</label>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Mặc định', value: 'default' },
                    { label: 'Giá: Thấp đến cao', value: 'price-asc' },
                    { label: 'Giá: Cao đến thấp', value: 'price-desc' }
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Thương hiệu</label>
                <Select
                  value={filterBrand}
                  onChange={setFilterBrand}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    ...brands.map((brand) => ({ label: brand, value: brand }))
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                block
                onClick={() => {
                  setSortBy('default');
                  setFilterBrand('all');
                  setCurrentPage(1);
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>

        <div style={{ marginBottom: '16px', color: '#666' }}>
          <strong>{filteredProducts.length}</strong> sản phẩm tìm thấy trong mục{' '}
          <strong>{catalogConfig.title}</strong>
        </div>

        <Spin spinning={loading}>
          {paginatedProducts.length > 0 ? (
            <>
              <div className="product-list-grid" style={{ marginBottom: '32px' }}>
                {paginatedProducts.map((product) => (
                  <div className="product-list-grid__item" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Pagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={itemsPerPage}
                    onChange={setCurrentPage}
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
