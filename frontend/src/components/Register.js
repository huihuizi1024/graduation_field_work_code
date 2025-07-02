import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { registerPersonal, registerOrganization, registerExpert } from '../api'; // 合并导入
import { sendSmsCode, registerWithSms } from '../api/sms'; // 添加SMS API导入
import { validateCreditCode, validatePhone, validateEmail, validatePassword } from '../utils/validation';
import { provinces, getCitiesByProvince, getDistrictsByCity } from '../data/regions';

const Register = () => {
  const [userType, setUserType] = useState('personal'); // 'personal' or 'organization'
  
  // 验证码相关状态
  const [smsState, setSmsState] = useState({
    loading: false,
    countdown: 0
  });
  
  // 表单验证状态
  const [validationErrors, setValidationErrors] = useState({
    personal: {},
    organization: {}
  });
  
  // 省市区选择状态
  const [regionState, setRegionState] = useState({
    selectedProvince: '',
    selectedCity: '',
    selectedDistrict: '',
    availableCities: [],
    availableDistricts: []
  });
  
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      email: '',
      username: '',
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
      agree: false,
      role: 1, // 默认为学生, 1: student, 3: expert
      expertise: '',
      description: ''
    },
    organization: {
      name: '',
      code: '',
      type: '',
      institutionLevel: '1', // 默认为国家级
      contact: '',
      phone: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      agree: false,
      legalRepresentative: '',
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      province: '',
      city: '',
      district: '',
      address: '',
      description: ''
    }
  });

  const navigate = useNavigate();

  // 倒计时效果
  useEffect(() => {
    let timer;
    if (smsState.countdown > 0) {
      timer = setTimeout(() => {
        setSmsState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [smsState.countdown]);

  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
    
    // 清除对应字段的验证错误
    if (validationErrors[type][field]) {
      setValidationErrors(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: ''
        }
      }));
    }
    
    // 实时验证
    validateField(type, field, value);
  };

  // 字段验证函数
  const validateField = (type, field, value) => {
    let validation = { isValid: true, message: '' };
    
    switch (field) {
      /*
      case 'code': // 统一社会信用代码
        if (value) {
          validation = validateCreditCode(value);
        }
        break;
      */
      case 'phone':
        if (value) {
          validation = validatePhone(value);
        }
        break;
      case 'email':
        if (value) {
          validation = validateEmail(value);
        }
        break;
      case 'password':
        if (value) {
          validation = validatePassword(value);
        }
        break;
      default:
        break;
    }
    
    if (!validation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: validation.message
        }
      }));
    }
  };

  // 省份选择处理
  const handleProvinceChange = (provinceCode) => {
    const province = provinces.find(p => p.code === provinceCode);
    const availableCities = getCitiesByProvince(provinceCode);
    
    setRegionState({
      selectedProvince: provinceCode,
      selectedCity: '',
      selectedDistrict: '',
      availableCities,
      availableDistricts: []
    });
    
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        provinceCode,
        province: province ? province.name : '',
        cityCode: '',
        city: '',
        districtCode: '',
        district: ''
      }
    }));
  };

  // 城市选择处理
  const handleCityChange = (cityCode) => {
    const city = regionState.availableCities.find(c => c.code === cityCode);
    const availableDistricts = getDistrictsByCity(cityCode);
    
    setRegionState(prev => ({
      ...prev,
      selectedCity: cityCode,
      selectedDistrict: '',
      availableDistricts
    }));
    
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        cityCode,
        city: city ? city.name : '',
        districtCode: '',
        district: ''
      }
    }));
  };

  // 区县选择处理
  const handleDistrictChange = (districtCode) => {
    const district = regionState.availableDistricts.find(d => d.code === districtCode);
    
    setRegionState(prev => ({
      ...prev,
      selectedDistrict: districtCode
    }));
    
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        districtCode,
        district: district ? district.name : ''
      }
    }));
  };

  const handleTabClick = (tab) => {
    setUserType(tab);
  };

  const handleGetCode = async () => {
    const phone = formData.personal.phone;
    
    if (!phone) {
      alert('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert('请输入正确的手机号格式');
      return;
    }

    if (smsState.countdown > 0) {
      return;
    }

    setSmsState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await sendSmsCode(phone, 'register');
      
      console.log('注册验证码发送响应:', response);
      
      if (response.code === 200) {
        alert('验证码发送成功！请查看控制台获取验证码');
        setSmsState(prev => ({ ...prev, loading: false, countdown: 60 }));
      } else {
        alert(response.message || '发送失败，请稍后重试');
        setSmsState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('发送失败，请稍后重试');
      setSmsState(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePersonalRegister = async (e) => {
    e.preventDefault();
    const data = formData.personal;
    
    if (data.password !== data.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (!data.agree) {
        alert('请阅读并同意协议');
        return;
    }

    try {
      // 如果用户输入了验证码，使用短信验证码注册
      if (data.code && data.code.trim()) {
        if (!/^\d{6}$/.test(data.code)) {
          alert('请输入6位数字验证码');
          return;
        }

        const smsRegisterData = {
          phone: data.phone,
          code: data.code,
          fullName: data.name,
          role: data.role,
          username: data.username || data.phone, // 如果没有用户名，使用手机号
          email: data.email // 添加邮箱
        };

        const response = await registerWithSms(
          smsRegisterData.phone,
          smsRegisterData.code,
          smsRegisterData.fullName,
          smsRegisterData.role,
          smsRegisterData.username,
          smsRegisterData.email // 传递邮箱参数
        );

        console.log('短信注册响应:', response);

        if (response.code === 200) {
          alert('注册成功！正在跳转到登录页面...');
          // 延迟跳转确保用户看到成功提示
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        } else {
          alert(response.message || '注册失败');
        }
      } else {
        // 原有的注册方式
        if (data.role === 1) { // 1 for student
          await registerPersonal(data);
          alert('学生账号注册成功！正在跳转到登录页面...');
        } else if (data.role === 3) { // 3 for expert
          if (!data.expertise.trim()) {
            alert('请输入您的专业领域');
            return;
          }
          
          // Prepare data for expert registration, ensuring 'fullName' is included
          const expertData = {
            ...data,
            fullName: data.name 
          };
          
          await registerExpert(expertData);
          alert('专家账号注册成功！正在跳转到登录页面...');
        }
        
        // 延迟跳转确保用户看到成功提示
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请检查您填写的信息';
      alert(errorMessage);
      console.error('注册失败:', error);
    }
  };

  const handleOrganizationRegister = async (e) => {
    e.preventDefault();
    const data = formData.organization;

    // 前端验证
    if (data.password !== data.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (!data.agree) {
        alert('请阅读并同意协议');
        return;
    }
    // ... 可以添加更多前端验证 ...
    
    try {
      await registerOrganization(data);
      alert('机构注册申请已提交！正在跳转到登录页面...');
      
      // 延迟跳转确保用户看到成功提示
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请检查您填写的信息';
      alert(errorMessage);
      console.error('机构注册失败:', error);
    }
  };

  const renderPersonalForm = () => (
    <form onSubmit={handlePersonalRegister} className="register-form">
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">注册为</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value={1}
                checked={formData.personal.role === 1}
                onChange={(e) => handleInputChange('personal', 'role', parseInt(e.target.value, 10))}
                className="form-radio h-4 w-4 text-primary focus:ring-primary/30"
              />
              <span className="ml-2 text-neutral-700">学生</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value={3}
                checked={formData.personal.role === 3}
                onChange={(e) => handleInputChange('personal', 'role', parseInt(e.target.value, 10))}
                className="form-radio h-4 w-4 text-primary focus:ring-primary/30"
              />
              <span className="ml-2 text-neutral-700">专家</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">姓名</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-user text-neutral-400"></i>
              </div>
              <input 
                type="text" 
                className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                placeholder="请输入您的真实姓名"
                value={formData.personal.name}
                onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">邮箱</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-envelope text-neutral-400"></i>
              </div>
              <input 
                type="email" 
                className={`form-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
                  validationErrors.personal.email ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
                }`}
                placeholder="请输入邮箱"
                value={formData.personal.email}
                onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                required
              />
              {validationErrors.personal.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fa fa-exclamation-circle text-red-400"></i>
                </div>
              )}
            </div>
            {validationErrors.personal.email && (
              <p className="form-error mt-1">{validationErrors.personal.email}</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">用户名</label>
           <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-user-circle-o text-neutral-400"></i>
              </div>
              <input type="text" value={formData.personal.username} onChange={(e) => handleInputChange('personal', 'username', e.target.value)} required 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
              placeholder="设置您的登录账号"/>
            </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">手机号</label>
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-phone text-neutral-400"></i>
              </div>
          <input type="tel" 
              value={formData.personal.phone} 
              onChange={(e) => handleInputChange('personal', 'phone', e.target.value)} 
              required
              className={`form-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
                validationErrors.personal.phone ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
              }`}
              placeholder="请输入您的手机号码" />
            {validationErrors.personal.phone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fa fa-exclamation-circle text-red-400"></i>
              </div>
            )}
            </div>
            {validationErrors.personal.phone && (
              <p className="form-error mt-1">{validationErrors.personal.phone}</p>
            )}
        </div>
        
        {/* 验证码输入框 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            手机验证码 
            <span className="text-xs text-gray-500 ml-2">(可选，填写后将使用手机号注册)</span>
          </label>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-shield text-neutral-400"></i>
              </div>
              <input 
                type="text" 
                value={formData.personal.code}
                onChange={(e) => handleInputChange('personal', 'code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
                placeholder="请输入6位验证码"
                maxLength="6"
              />
            </div>
            <button
              type="button"
              onClick={handleGetCode}
              disabled={smsState.loading || smsState.countdown > 0}
              className={`px-4 py-3 rounded-lg font-medium transition-custom whitespace-nowrap ${
                smsState.loading || smsState.countdown > 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {smsState.loading ? '发送中...' : smsState.countdown > 0 ? `${smsState.countdown}s` : '获取验证码'}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 提示：点击"获取验证码"后，请查看IDEA后端控制台获取验证码
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">设置密码</label>
          <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-lock text-neutral-400"></i>
              </div>
          <input type="password" value={formData.personal.password} onChange={(e) => handleInputChange('personal', 'password', e.target.value)} required
            className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
            placeholder="设置您的登录密码" />
            </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-600 mb-2">确认密码</label>
          <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-lock text-neutral-400"></i>
              </div>
          <input type="password" value={formData.personal.confirmPassword} onChange={(e) => handleInputChange('personal', 'confirmPassword', e.target.value)} required
            className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
            placeholder="请再次输入密码" />
            </div>
        </div>
        
        {formData.personal.role === 3 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-600 mb-2">专业领域</label>
              <input type="text" value={formData.personal.expertise} onChange={(e) => handleInputChange('personal', 'expertise', e.target.value)} required 
                className="form-input block w-full pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
                placeholder="如: 人工智能、金融科技" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-600 mb-2">个人简介</label>
              <textarea value={formData.personal.description} onChange={(e) => handleInputChange('personal', 'description', e.target.value)}
                className="form-textarea block w-full pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
                placeholder="简单介绍您的专业背景、成就等"
                rows="4"
              ></textarea>
            </div>
          </>
        )}
        
        <div className="mb-8 flex items-start">
          <input 
            id="personal-agree" 
            type="checkbox" 
            className="h-4 w-4 text-primary focus:ring-primary/30 border-neutral-300 rounded transition-custom mt-1"
            checked={formData.personal.agree} 
            onChange={(e) => handleInputChange('personal', 'agree', e.target.checked)} 
          />
          <label htmlFor="personal-agree" className="ml-3 text-sm text-neutral-600">
            我已阅读并同意
            <button type="button" className="text-primary hover:text-primary/80 transition-custom mx-1">《用户协议》</button>
            和
            <button type="button" className="text-primary hover:text-primary/80 transition-custom mx-1">《隐私政策》</button>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          完成注册
        </button>
    </form>
  );

  const renderOrganizationForm = () => (
    <form onSubmit={handleOrganizationRegister} className="register-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">机构名称</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-building text-neutral-400"></i>
            </div>
            <input 
              type="text" 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
              placeholder="请输入机构全称"
              value={formData.organization.name} 
              onChange={(e) => handleInputChange('organization', 'name', e.target.value)} 
              required 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">统一社会信用代码</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-id-card text-neutral-400"></i>
            </div>
            <input 
              type="text" 
              className={`form-input credit-code-format block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
                validationErrors.organization.code ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
              }`}
              placeholder="请输入18位统一社会信用代码"
              value={formData.organization.code} 
              onChange={(e) => handleInputChange('organization', 'code', e.target.value)} 
              maxLength="18"
              required 
            />
            {validationErrors.organization.code && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fa fa-exclamation-circle text-red-400"></i>
              </div>
            )}
          </div>
          {validationErrors.organization.code && (
            <p className="form-error mt-1">{validationErrors.organization.code}</p>
          )}
          {!validationErrors.organization.code && formData.organization.code && (
            <p className="validation-hint mt-1">
              <i className="fa fa-info-circle mr-1"></i>
              统一社会信用代码格式正确
            </p>
          )}
          {!formData.organization.code && (
            <p className="validation-hint mt-1">
              <i className="fa fa-lightbulb-o mr-1"></i>
              请输入机构的18位统一社会信用代码，系统将自动验证格式
              <br />
              <span className="text-xs text-gray-400 mt-1 block">
                测试用代码: 91110000633674095F （北京某公司真实代码）
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-600 mb-2">机构类型</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa fa-sitemap text-neutral-400"></i>
          </div>
          <select 
            className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none bg-white"
            value={formData.organization.type} 
            onChange={(e) => handleInputChange('organization', 'type', e.target.value)} 
            required
          >
            <option value="">请选择机构类型</option>
            <option value="1">高等院校</option>
            <option value="2">职业院校</option>
            <option value="3">培训机构</option>
            <option value="4">社会组织</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fa fa-chevron-down text-neutral-400 text-sm"></i>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-600 mb-2">机构级别</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa fa-trophy text-neutral-400"></i>
          </div>
          <select 
            className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none bg-white"
            value={formData.organization.institutionLevel} 
            onChange={(e) => handleInputChange('organization', 'institutionLevel', e.target.value)} 
          >
            <option value="1">国家级</option>
            <option value="2">省级</option>
            <option value="3">市级</option>
            <option value="4">区县级</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fa fa-chevron-down text-neutral-400 text-sm"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">联系人姓名</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-user text-neutral-400"></i>
            </div>
            <input 
              type="text" 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
              placeholder="机构联系人姓名"
              value={formData.organization.contact} 
              onChange={(e) => handleInputChange('organization', 'contact', e.target.value)} 
              required 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">联系电话</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-phone text-neutral-400"></i>
            </div>
            <input 
              type="tel" 
              className={`form-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
                validationErrors.organization.phone ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
              }`}
              placeholder="联系人手机号码"
              value={formData.organization.phone} 
              onChange={(e) => handleInputChange('organization', 'phone', e.target.value)} 
              required 
            />
            {validationErrors.organization.phone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fa fa-exclamation-circle text-red-400"></i>
              </div>
            )}
          </div>
          {validationErrors.organization.phone && (
            <p className="form-error mt-1">{validationErrors.organization.phone}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-600 mb-2">电子邮箱</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa fa-envelope text-neutral-400"></i>
          </div>
          <input 
            type="email" 
            className={`form-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
              validationErrors.organization.email ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
            }`}
            placeholder="机构邮箱地址"
            value={formData.organization.email} 
            onChange={(e) => handleInputChange('organization', 'email', e.target.value)} 
            required 
          />
          {validationErrors.organization.email && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fa fa-exclamation-circle text-red-400"></i>
            </div>
          )}
        </div>
        {validationErrors.organization.email && (
          <p className="form-error mt-1">{validationErrors.organization.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">管理员用户名</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-user-circle-o text-neutral-400"></i>
            </div>
            <input 
              type="text" 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
              placeholder="设置管理员登录账号"
              value={formData.organization.username} 
              onChange={(e) => handleInputChange('organization', 'username', e.target.value)} 
              required 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">法定代表人</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-id-badge text-neutral-400"></i>
            </div>
            <input 
              type="text" 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
              placeholder="法定代表人姓名"
              value={formData.organization.legalRepresentative} 
              onChange={(e) => handleInputChange('organization', 'legalRepresentative', e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">设置密码</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-lock text-neutral-400"></i>
            </div>
            <input 
              type="password" 
              className={`form-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom ${
                validationErrors.organization.password ? 'border-red-300 focus:border-red-500' : 'border-neutral-300'
              }`}
              placeholder="设置管理员登录密码"
              value={formData.organization.password} 
              onChange={(e) => handleInputChange('organization', 'password', e.target.value)} 
              required 
            />
            {validationErrors.organization.password && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fa fa-exclamation-circle text-red-400"></i>
              </div>
            )}
          </div>
          {validationErrors.organization.password && (
            <p className="form-error mt-1">{validationErrors.organization.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">确认密码</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-lock text-neutral-400"></i>
            </div>
            <input 
              type="password" 
              className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
              placeholder="请再次输入密码"
              value={formData.organization.confirmPassword} 
              onChange={(e) => handleInputChange('organization', 'confirmPassword', e.target.value)} 
              required 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">省份</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-map-marker text-neutral-400"></i>
            </div>
            <select 
              className="form-input block w-full pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none bg-white"
              value={regionState.selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
            >
              <option value="">请选择省份</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fa fa-chevron-down text-neutral-400 text-sm"></i>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">城市</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-building text-neutral-400"></i>
            </div>
            <select 
              className="form-input block w-full pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none bg-white"
              value={regionState.selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!regionState.selectedProvince}
            >
              <option value="">请选择城市</option>
              {regionState.availableCities.map(city => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fa fa-chevron-down text-neutral-400 text-sm"></i>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">区/县</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-map-pin text-neutral-400"></i>
            </div>
            <select 
              className="form-input block w-full pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none bg-white"
              value={regionState.selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!regionState.selectedCity}
            >
              <option value="">请选择区/县</option>
              {regionState.availableDistricts.map(district => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i className="fa fa-chevron-down text-neutral-400 text-sm"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-600 mb-2">详细地址</label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <i className="fa fa-home text-neutral-400"></i>
          </div>
          <input 
            type="text" 
            className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom"
            placeholder="请输入详细地址"
            value={formData.organization.address} 
            onChange={(e) => handleInputChange('organization', 'address', e.target.value)} 
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-600 mb-2">机构简介</label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <i className="fa fa-file-text text-neutral-400"></i>
          </div>
          <textarea 
            className="form-textarea block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom resize-none"
            placeholder="简要介绍机构的基本情况、办学特色等"
            rows="4"
            value={formData.organization.description} 
            onChange={(e) => handleInputChange('organization', 'description', e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mb-8 flex items-start">
        <input 
          id="org-agree" 
          type="checkbox" 
          className="h-4 w-4 text-primary focus:ring-primary/30 border-neutral-300 rounded transition-custom mt-1"
          checked={formData.organization.agree} 
          onChange={(e) => handleInputChange('organization', 'agree', e.target.checked)} 
        />
        <label htmlFor="org-agree" className="ml-3 text-sm text-neutral-600">
          我已阅读并同意
          <button type="button" className="text-primary hover:text-primary/80 transition-custom mx-1">《用户协议》</button>
          和
          <button type="button" className="text-primary hover:text-primary/80 transition-custom mx-1">《隐私政策》</button>
        </label>
      </div>

      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        提交注册申请
      </button>
    </form>
  );

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
                <i className="fa fa-graduation-cap text-xl"></i>
              </div>
              <span className="text-xl font-bold text-neutral-700">学分银行系统</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => navigate('/')} className="text-neutral-600 hover:text-primary transition-custom">返回主页</button>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom">关于我们</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom">帮助中心</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom">联系我们</a>
            </nav>
            <div className="md:hidden">
              <button className="text-neutral-600 focus:outline-none">
                <i className="fa fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          {/* 页面标题 */}
          <div className="text-center mb-10">
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-neutral-700 mb-2">创建新账号</h1>
            <p className="text-neutral-500">请填写以下信息完成注册</p>
          </div>
          
          {/* 注册表单 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 fade-in">
            {/* 注册类型切换 */}
            <div className="register-tabs">
              <div 
                className={`register-tab ${userType === 'personal' ? 'tab-active' : ''}`} 
                onClick={() => handleTabClick('personal')}
              >
                个人注册
              </div>
              <div 
                className={`register-tab ${userType === 'organization' ? 'tab-active' : ''}`} 
                onClick={() => handleTabClick('organization')}
              >
                机构注册
              </div>
            </div>
            
            {userType === 'personal' ? renderPersonalForm() : renderOrganizationForm()}
            
            <div className="mt-6 text-center">
              <p className="text-neutral-500">
                已有账号? <button onClick={() => navigate('/login')} className="text-primary hover:text-primary/80 transition-custom font-medium">立即登录</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 