import api from './index';

export const getTransactions = (params) => {
  return api.get('/api/transactions', { params });
};

export const getTransactionById = (id) => {
  return api.get(`/api/transactions/${id}`);
};

export const getMyTransactions = () => {
  return api.get('/api/transactions/my-transactions');
};

export const createTransaction = (data) => {
  return api.post('/api/transactions', data);
};

export const updateTransaction = (id, data) => {
  return api.put(`/api/transactions/${id}`, data);
};

export const deleteTransaction = (id) => {
  return api.delete(`/api/transactions/${id}`);
};
