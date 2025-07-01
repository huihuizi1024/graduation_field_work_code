import api from './index';

export const uploadImage = (formData) => {
  return api.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}; 