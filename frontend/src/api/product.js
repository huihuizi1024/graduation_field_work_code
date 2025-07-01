import api from './index';

export const getProducts = (params) => {
  return api.get('/api/products', { params });
};

export const getProductById = (id) => {
  return api.get(`/api/products/${id}`);
};

export const createProduct = (data) => {
  return api.post('/api/products', data);
};

export const updateProduct = (id, data) => {
  return api.put(`/api/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/api/products/${id}`);
};

export const changeProductStatus = (id, status) => {
  return api.put(`/api/products/${id}/status`, null, { params: { status } });
}; 