import { message } from 'antd';

// 文件大小限制配置 (单位: MB)
const FILE_SIZE_LIMITS = {
  IMAGE: 10,     // 图片文件限制 10MB
  VIDEO: 100,    // 视频文件限制 100MB
  DOCUMENT: 20,  // 文档文件限制 20MB
  DEFAULT: 10    // 默认限制 10MB
};

// 文件类型配置
const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

/**
 * 格式化文件大小显示
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的大小字符串
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 获取文件类型
 * @param {string} mimeType - 文件MIME类型
 * @returns {string} 文件类型分类
 */
export const getFileType = (mimeType) => {
  if (FILE_TYPES.IMAGE.includes(mimeType)) return 'IMAGE';
  if (FILE_TYPES.VIDEO.includes(mimeType)) return 'VIDEO';
  if (FILE_TYPES.DOCUMENT.includes(mimeType)) return 'DOCUMENT';
  return 'OTHER';
};

/**
 * 验证文件大小
 * @param {File} file - 要验证的文件
 * @param {string} fileType - 文件类型 (IMAGE, VIDEO, DOCUMENT, 或自定义)
 * @param {number} customLimit - 自定义大小限制 (MB)
 * @returns {boolean} 是否通过验证
 */
export const validateFileSize = (file, fileType = null, customLimit = null) => {
  if (!file) return false;
  
  // 确定文件类型
  const detectedType = fileType || getFileType(file.type);
  
  // 确定大小限制
  const sizeLimit = customLimit || FILE_SIZE_LIMITS[detectedType] || FILE_SIZE_LIMITS.DEFAULT;
  
  // 转换为字节
  const limitInBytes = sizeLimit * 1024 * 1024;
  
  // 验证文件大小
  if (file.size > limitInBytes) {
    const currentSize = formatFileSize(file.size);
    const limitSize = formatFileSize(limitInBytes);
    
    message.error(`文件大小超过限制！当前文件大小：${currentSize}，最大允许：${limitSize}`);
    return false;
  }
  
  return true;
};

/**
 * 验证文件类型
 * @param {File} file - 要验证的文件
 * @param {string[]} allowedTypes - 允许的文件类型数组
 * @returns {boolean} 是否通过验证
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes || allowedTypes.length === 0) return false;
  
  const isValidType = allowedTypes.some(type => {
    if (type.includes('*')) {
      // 处理通配符类型，如 'image/*'
      const prefix = type.split('/')[0];
      return file.type.startsWith(prefix + '/');
    }
    return file.type === type;
  });
  
  if (!isValidType) {
    const allowedExtensions = allowedTypes.map(type => {
      if (type.includes('*')) {
        return type.split('/')[0] + '类型';
      }
      return type.split('/')[1]?.toUpperCase() || type;
    }).join(', ');
    
    message.error(`不支持的文件类型！当前文件类型：${file.type}，支持的类型：${allowedExtensions}`);
    return false;
  }
  
  return true;
};

/**
 * 综合文件验证
 * @param {File} file - 要验证的文件
 * @param {Object} options - 验证选项
 * @param {string[]} options.allowedTypes - 允许的文件类型
 * @param {number} options.maxSize - 最大文件大小 (MB)
 * @param {string} options.fileType - 文件类型分类
 * @returns {boolean} 是否通过验证
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = [],
    maxSize = null,
    fileType = null
  } = options;
  
  // 验证文件类型
  if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
    return false;
  }
  
  // 验证文件大小
  if (!validateFileSize(file, fileType, maxSize)) {
    return false;
  }
  
  return true;
};

/**
 * 图片文件验证
 * @param {File} file - 图片文件
 * @returns {boolean} 是否通过验证
 */
export const validateImage = (file) => {
  return validateFile(file, {
    allowedTypes: ['image/*'],
    fileType: 'IMAGE'
  });
};

/**
 * 视频文件验证
 * @param {File} file - 视频文件
 * @returns {boolean} 是否通过验证
 */
export const validateVideo = (file) => {
  return validateFile(file, {
    allowedTypes: ['video/*'],
    fileType: 'VIDEO'
  });
};

/**
 * 文档文件验证
 * @param {File} file - 文档文件
 * @returns {boolean} 是否通过验证
 */
export const validateDocument = (file) => {
  return validateFile(file, {
    allowedTypes: FILE_TYPES.DOCUMENT,
    fileType: 'DOCUMENT'
  });
};

// 导出文件大小限制配置供其他组件使用
export { FILE_SIZE_LIMITS, FILE_TYPES }; 