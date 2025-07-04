import api from './index';

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Upload request details:', {
    file: file,
    formData: Array.from(formData.entries()),
    contentType: file.type
  });
  
  return api.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    transformRequest: [(data) => data],
    timeout: 30000
  });
}; 