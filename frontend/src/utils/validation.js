// 统一社会信用代码验证工具

/**
 * 验证统一社会信用代码
 * @param {string} code - 18位统一社会信用代码
 * @returns {object} - 验证结果 {isValid: boolean, message: string}
 */
export const validateCreditCode = (code) => {
  // 移除空格和特殊字符
  const cleanCode = code.replace(/\s|-/g, '').toUpperCase();
  
  // 空值检查
  if (!cleanCode) {
    return {
      isValid: false,
      message: '请输入统一社会信用代码'
    };
  }
  
  // 长度检查
  if (cleanCode.length < 18) {
    return {
      isValid: false,
      message: `统一社会信用代码长度不足，当前${cleanCode.length}位，需要18位`
    };
  }
  
  if (cleanCode.length > 18) {
    return {
      isValid: false,
      message: `统一社会信用代码长度超出，当前${cleanCode.length}位，需要18位`
    };
  }
  
  // 字符检查 - 只允许数字和大写字母，排除I、O、S、V、Z
  const validChars = /^[0-9A-HJ-NPQRTUWXY]+$/;
  if (!validChars.test(cleanCode)) {
    return {
      isValid: false,
      message: '统一社会信用代码包含无效字符，请检查输入'
    };
  }
  
  // 前置码检查
  const firstChar = cleanCode[0];
  const validFirstChars = ['1', '2', '3', '4', '5', '9', 'A', 'N', 'Y'];
  if (!validFirstChars.includes(firstChar)) {
    return {
      isValid: false,
      message: '统一社会信用代码首位字符无效'
    };
  }
  
  // 校验码计算
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const charIndex = chars.indexOf(cleanCode[i]);
    if (charIndex === -1) {
      return {
        isValid: false,
        message: '统一社会信用代码格式错误'
      };
    }
    sum += charIndex * weights[i];
  }
  
  const remainder = sum % 31;
  const checkCode = remainder === 0 ? '0' : chars[31 - remainder];
  
  if (cleanCode[17] !== checkCode) {
    return {
      isValid: false,
      message: '统一社会信用代码校验位错误，请核实代码'
    };
  }
  
  return {
    isValid: true,
    message: '统一社会信用代码验证通过'
  };
};

/**
 * 格式化统一社会信用代码显示（添加连字符）
 * @param {string} code - 原始代码
 * @returns {string} - 格式化后的代码
 */
export const formatCreditCode = (code) => {
  const cleanCode = code.replace(/\s|-/g, '');
  if (cleanCode.length <= 18) {
    return cleanCode.replace(/(.{6})(.{9})(.{3})/, '$1-$2-$3');
  }
  return cleanCode;
};

/**
 * 手机号验证
 * @param {string} phone - 手机号
 * @returns {object} - 验证结果
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  
  if (!phone) {
    return {
      isValid: false,
      message: '请输入手机号'
    };
  }
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: '请输入有效的11位手机号'
    };
  }
  
  return {
    isValid: true,
    message: '手机号格式正确'
  };
};

/**
 * 邮箱验证
 * @param {string} email - 邮箱地址
 * @returns {object} - 验证结果
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      isValid: false,
      message: '请输入邮箱地址'
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: '请输入有效的邮箱地址'
    };
  }
  
  return {
    isValid: true,
    message: '邮箱格式正确'
  };
};

/**
 * 密码强度验证
 * @param {string} password - 密码
 * @returns {object} - 验证结果
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: '请输入密码'
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      message: '密码长度至少6位'
    };
  }
  
  if (password.length > 20) {
    return {
      isValid: false,
      message: '密码长度不能超过20位'
    };
  }
  
  // 检查是否包含至少一个数字和一个字母
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (!hasNumber || !hasLetter) {
    return {
      isValid: false,
      message: '密码需包含至少一个字母和一个数字'
    };
  }
  
  return {
    isValid: true,
    message: '密码强度符合要求'
  };
}; 