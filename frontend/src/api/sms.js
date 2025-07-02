import api from './index';

// 发送短信验证码
export const sendSmsCode = (phone, type = 'login') => {
  return api.post('/api/sms/send', { 
    phone, 
    type 
  });
};

// 短信验证码登录
export const loginWithSms = (phone, code, identity) => {
  return api.post('/api/sms/login', { 
    phone, 
    code, 
    identity 
  });
};

// 短信验证码注册
export const registerWithSms = (phone, code, fullName, role, username = null) => {
  return api.post('/api/sms/register', { 
    phone, 
    code, 
    fullName, 
    role,
    username: username || phone // 如果没有提供用户名，使用手机号
  });
}; 