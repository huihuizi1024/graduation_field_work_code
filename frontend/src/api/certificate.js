import api, { getToken } from './index';

export const getApplications = (status) => {
  return api.get('/api/certification-applications', {
    params: { status }
  });
};

export const reviewApplication = (id, reviewStatus, reviewComment = '') => {
  return api.post(`/api/certification-applications/${id}/review`, null, {
    params: { reviewStatus, reviewComment }
  });
};

// 学生提交证书申请
export const applyCertificate = (standardId, evidenceUrl = '') => {
  return api.post('/api/certification-applications', {
    standardId,
    evidenceUrl
  });
};

// 获取当前用户的申请列表
export const getMyApplications = () => {
  return api.get('/api/certification-applications/my');
};

// 获取已获得证书列表
export const getMyCertificates = () => {
  return api.get('/api/certification-applications/my-certificates');
};

// 获取专家审核记录
export const getMyReviewedApplications = () => {
  return api.get('/api/certification-applications/my-reviewed');
};

// 取消申请
export const cancelApplication = (id) => {
  return api.delete(`/api/certification-applications/${id}`);
};

// 获取申请详情
export const getApplicationById = (id) => {
  return api.get(`/api/certification-applications/${id}`);
}; 