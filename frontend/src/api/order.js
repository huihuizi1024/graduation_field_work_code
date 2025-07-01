import api from './index';

export const getOrders = (params) => {
  return api.get('/api/orders', { params });
};

export const getOrderById = (id) => {
  return api.get(`/api/orders/${id}`);
};

export const getMyOrders = () => {
  return api.get('/api/orders/my-orders');
};

export const createOrder = (data) => {
  return api.post('/api/orders', data);
};

export const updateOrder = (id, data) => {
  return api.put(`/api/orders/${id}`, data);
};

export const deleteOrder = (id) => {
  return api.delete(`/api/orders/${id}`);
};

export const changeOrderStatus = (id, status) => {
  return api.put(`/api/orders/${id}/status`, null, { params: { status } });
};

export const purchaseProduct = (data) => {
  return api.post('/api/orders/purchase', data);
}; 