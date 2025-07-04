import api from './index';

// 获取认证标准列表（status=1 有效）
export const getCertificationStandards = (status = 1) => {
  return api.get('/api/certification-standards', { params: { status } });
};
