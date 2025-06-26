import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // 禁用自动发送cookie
});

  // 请求拦截器
api.interceptors.request.use(config => {
  // 清理不必要的headers
  const allowedHeaders = ['Content-Type', 'Accept', 'Authorization'];
  Object.keys(config.headers).forEach(key => {
    if (!allowedHeaders.includes(key)) {
      delete config.headers[key];
    }
  });

  // 处理GET请求参数
  if (config.params) {
    config.params = Object.fromEntries(
      Object.entries(config.params).filter(([_, v]) => 
        v !== undefined && v !== null && v !== ''
      )
    );
  }

  // 处理POST/PUT请求的data参数
  if (config.data && typeof config.data === 'object') {
    config.data = Object.fromEntries(
      Object.entries(config.data).filter(([_, v]) => 
        v !== undefined && v !== null && v !== ''
      )
    );
  }

  // 处理URL中的查询参数
  if (config.url && config.url.includes('?')) {
    const [baseUrl, query] = config.url.split('?');
    const params = new URLSearchParams(query);
    
    Array.from(params.entries()).forEach(([key, value]) => {
      if (value === 'undefined' || value === 'null' || value === '') {
        params.delete(key);
      }
    });

    config.url = baseUrl + (params.toString() ? `?${params.toString()}` : '');
  }

  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
