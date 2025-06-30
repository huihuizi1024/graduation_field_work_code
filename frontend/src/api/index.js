import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // 启用跨域请求时发送cookie
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

  // 注入令牌
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
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

// 登录API
export const login = (username, password, identityType) => {
  return api.post('/api/auth/login', {
    username,
    passwordHash: password
  }, {
    params: { identityType }
  });

};

// 登出API
export const logout = () => {
  return api.post('/api/auth/logout');
};

// 获取当前用户信息
export const getCurrentUser = () => {
  return api.get('/api/users/me');
};

// 更新用户信息
export const updateUserInfo = (userData) => {
  return api.put('/api/users/me', userData);
};

// 注册API
export const register = (userData) => {
  return api.post('/api/auth/register', userData);
};

export default api;
