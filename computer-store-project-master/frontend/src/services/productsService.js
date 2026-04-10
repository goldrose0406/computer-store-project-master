import { normalizeProductCategory } from '../utils/productCategories';

const API_BASE_URL = 'http://localhost:5000/api';

const parseSpecs = (specs) => {
  if (!specs) {
    return {};
  }

  if (typeof specs === 'object') {
    return specs;
  }

  try {
    return JSON.parse(specs);
  } catch (error) {
    return {};
  }
};

const normalizeProduct = (product = {}) => ({
  ...product,
  category: normalizeProductCategory(product.category),
  price: Number(product.price) || 0,
  originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
  specs: parseSpecs(product.specs)
});

export const productsService = {
  getAllProducts: async (filters = {}) => {
    try {
      const query = new URLSearchParams();

      if (filters.category) query.append('category', filters.category);
      if (filters.brand) query.append('brand', filters.brand);
      if (filters.search) query.append('search', filters.search);
      if (filters.priceMin) query.append('priceMin', filters.priceMin);
      if (filters.priceMax) query.append('priceMax', filters.priceMax);
      if (filters.page) query.append('page', filters.page);
      if (filters.limit) query.append('limit', filters.limit);

      const response = await fetch(`${API_BASE_URL}/products?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch products' };
      }

      return {
        success: true,
        products: (data.products || []).map(normalizeProduct),
        pagination: data.pagination || null
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Product not found' };
      }

      return { success: true, product: normalizeProduct(data.product) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getBrands: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/brands`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch brands' };
      }

      return { success: true, brands: data.brands || [] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to fetch categories' };
      }

      return { success: true, categories: data.categories || [] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  createProduct: async (product, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to create product' };
      }

      return { success: true, product: data.product ? normalizeProduct(data.product) : null };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  uploadProductImage: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to upload image' };
      }

      return { success: true, imageUrl: data.imageUrl };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateProduct: async (id, updates, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update product' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  deleteProduct: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to delete product' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};
