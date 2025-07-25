import axios from 'axios';
import { message as antMessage } from 'antd';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // 启用跨域请求时发送cookie
});

// 请求拦截器
api.interceptors.request.use(config => {
  // 如果是FormData，不设置Content-Type，让浏览器自动设置
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

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

  // 处理POST/PUT请求的data参数，但不处理FormData
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
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

  // 注入令牌
  const token = localStorage.getItem('token');
  if (token) {
    console.log('JWT Token size:', token.length, 'characters');
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', {
      config: error.config,
      response: error.response,
      message: error.message
    });
    
    // 统一弹出后端错误信息
    const msg = error.response?.data?.message || '请求失败';
    if (msg) {
      antMessage.error(msg);
    }
    
    return Promise.reject(error);
  }
);

// 获取JWT令牌
export const getToken = () => {
  return localStorage.getItem('token');
};

// 登录API
export const login = (username, password, identity) => {
  return api.post('/api/auth/authenticate', { username, password, identity });
};

// 登出API
export const logout = () => {
  return api.post('/api/auth/logout');
};

// 获取当前用户信息
export const getCurrentUser = () => api.get('/api/users/me');

// 更新用户信息
export const updateUserInfo = (data) => api.put('/api/users/me', data);

// 个人和专家注册
export const registerPersonal = (userData) => {
  // 确保将name字段映射到fullName字段
  const formattedData = {
    ...userData,
    fullName: userData.name
  };
  return api.post('/api/auth/register/personal', formattedData);
};

// 机构注册
export const registerOrganization = (userData) => {
  return api.post('/api/auth/register/organization', userData);
};

// 专家注册API
export const registerExpert = (registrationData) => {
  return api.post('/api/auth/register/expert', registrationData);
};

// 获取当前专家信息
export const getCurrentExpert = () => api.get('/api/experts/me');

// 更新当前专家信息
export const updateCurrentExpert = (data) => api.put('/api/experts/me', data);

// 获取当前机构信息
export const getCurrentInstitution = () => api.get('/api/institutions/me');

// 更新当前机构信息
export const updateCurrentInstitution = (data) => api.put('/api/institutions/me', data);

// 获取积分规则列表
export const getPointRules = (params = {}) => {
  return api.get('/api/point-rules', { params });
};

// 获取转换规则列表
export const getConversionRules = (params = {}) => {
  return api.get('/api/conversion-rules', { params });
};

export default api;
