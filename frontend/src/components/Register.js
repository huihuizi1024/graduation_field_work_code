import React, { useState } from 'react';
import './Register.css';

const Register = ({ onBackToLogin, onBackToMain }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      id: '',
      username: '',
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
      agree: false
    },
    organization: {
      name: '',
      code: '',
      type: '',
      contact: '',
      phone: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      agree: false
    }
  });

  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleGetCode = () => {
    const phone = formData.personal.phone;
    const phoneRegex = /^1[3-9]\d{9}$/;
    
    if (!phone) {
      alert('请输入手机号');
      return;
    } else if (!phoneRegex.test(phone)) {
      alert('请输入有效的手机号');
      return;
    }
    
    const getCodeBtn = document.getElementById('personal-get-code');
    if (getCodeBtn) {
      let countdown = 60;
      getCodeBtn.disabled = true;
      getCodeBtn.textContent = `${countdown}秒后重新获取`;
      
      const timer = setInterval(() => {
        countdown--;
        getCodeBtn.textContent = `${countdown}秒后重新获取`;
        
        if (countdown <= 0) {
          clearInterval(timer);
          getCodeBtn.disabled = false;
          getCodeBtn.textContent = '获取验证码';
        }
      }, 1000);
    }
    
    console.log(`向手机号 ${phone} 发送验证码`);
  };

  const handlePersonalRegister = () => {
    const data = formData.personal;
    let isValid = true;
    
    // 验证姓名
    if (!data.name.trim()) {
      alert('请输入姓名');
      isValid = false;
    }
    
    // 验证身份证号
    const idCardRegex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!data.id.trim()) {
      alert('请输入身份证号');
      isValid = false;
    } else if (!idCardRegex.test(data.id)) {
      alert('请输入有效的身份证号');
      isValid = false;
    }
    
    // 验证用户名
    if (!data.username.trim()) {
      alert('请输入用户名');
      isValid = false;
    } else if (data.username.length < 3) {
      alert('用户名长度至少为3个字符');
      isValid = false;
    }
    
    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!data.phone.trim()) {
      alert('请输入手机号');
      isValid = false;
    } else if (!phoneRegex.test(data.phone)) {
      alert('请输入有效的手机号');
      isValid = false;
    }
    
    // 验证验证码
    if (!data.code.trim()) {
      alert('请输入验证码');
      isValid = false;
    } else if (data.code.length !== 6) {
      alert('验证码长度为6位');
      isValid = false;
    }
    
    // 验证密码
    if (!data.password) {
      alert('请输入密码');
      isValid = false;
    } else if (data.password.length < 6) {
      alert('密码长度至少为6位');
      isValid = false;
    }
    
    // 验证确认密码
    if (!data.confirmPassword) {
      alert('请确认密码');
      isValid = false;
    } else if (data.confirmPassword !== data.password) {
      alert('两次输入的密码不一致');
      isValid = false;
    }
    
    // 验证是否同意协议
    if (!data.agree) {
      alert('请阅读并同意用户服务协议和隐私政策');
      isValid = false;
    }
    
    if (isValid) {
      alert('注册信息提交成功！请等待审核');
      onBackToLogin();
    }
  };

  const handleOrganizationRegister = () => {
    const data = formData.organization;
    let isValid = true;
    
    // 验证机构名称
    if (!data.name.trim()) {
      alert('请输入机构名称');
      isValid = false;
    }
    
    // 验证统一社会信用代码
    const orgCodeRegex = /^[0-9A-HJ-NPQRTUWXY]{18}$/;
    if (!data.code.trim()) {
      alert('请输入统一社会信用代码');
      isValid = false;
    } else if (!orgCodeRegex.test(data.code)) {
      alert('请输入有效的统一社会信用代码');
      isValid = false;
    }
    
    // 验证机构类型
    if (!data.type) {
      alert('请选择机构类型');
      isValid = false;
    }
    
    // 验证联系人姓名
    if (!data.contact.trim()) {
      alert('请输入联系人姓名');
      isValid = false;
    }
    
    // 验证联系电话
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!data.phone.trim()) {
      alert('请输入联系电话');
      isValid = false;
    } else if (!phoneRegex.test(data.phone)) {
      alert('请输入有效的联系电话');
      isValid = false;
    }
    
    // 验证电子邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      alert('请输入电子邮箱');
      isValid = false;
    } else if (!emailRegex.test(data.email)) {
      alert('请输入有效的电子邮箱');
      isValid = false;
    }
    
    // 验证用户名
    if (!data.username.trim()) {
      alert('请输入用户名');
      isValid = false;
    } else if (data.username.length < 3) {
      alert('用户名长度至少为3个字符');
      isValid = false;
    }
    
    // 验证密码
    if (!data.password) {
      alert('请输入密码');
      isValid = false;
    } else if (data.password.length < 6) {
      alert('密码长度至少为6位');
      isValid = false;
    }
    
    // 验证确认密码
    if (!data.confirmPassword) {
      alert('请确认密码');
      isValid = false;
    } else if (data.confirmPassword !== data.password) {
      alert('两次输入的密码不一致');
      isValid = false;
    }
    
    // 验证是否同意协议
    if (!data.agree) {
      alert('请阅读并同意用户服务协议和隐私政策');
      isValid = false;
    }
    
    if (isValid) {
      alert('注册信息提交成功！请等待审核');
      onBackToLogin();
    }
  };

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
              <button onClick={onBackToMain} className="text-neutral-600 hover:text-primary transition-custom">返回主页</button>
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
                className={`register-tab ${activeTab === 'personal' ? 'tab-active' : ''}`} 
                onClick={() => handleTabClick('personal')}
              >
                个人注册
              </div>
              <div 
                className={`register-tab ${activeTab === 'organization' ? 'tab-active' : ''}`} 
                onClick={() => handleTabClick('organization')}
              >
                机构注册
              </div>
            </div>
            
            {/* 个人注册表单 */}
            {activeTab === 'personal' && (
              <div className="register-content active">
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
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">身份证号</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa fa-id-card text-neutral-400"></i>
                      </div>
                      <input 
                        type="text" 
                        className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                        placeholder="请输入18位身份证号码"
                        value={formData.personal.id}
                        onChange={(e) => handleInputChange('personal', 'id', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">用户名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-user-o text-neutral-400"></i>
                    </div>
                    <input 
                      type="text" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请设置用户名"
                      value={formData.personal.username}
                      onChange={(e) => handleInputChange('personal', 'username', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">手机号</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-phone text-neutral-400"></i>
                    </div>
                    <input 
                      type="tel" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入手机号"
                      value={formData.personal.phone}
                      onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">验证码</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-shield text-neutral-400"></i>
                    </div>
                    <input 
                      type="text" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入验证码"
                      value={formData.personal.code}
                      onChange={(e) => handleInputChange('personal', 'code', e.target.value)}
                    />
                    <button 
                      id="personal-get-code" 
                      className="absolute right-2 top-2 bottom-2 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium transition-custom hover:bg-primary/20"
                      onClick={handleGetCode}
                    >
                      获取验证码
                    </button>
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
                        className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                        placeholder="请设置密码"
                        value={formData.personal.password}
                        onChange={(e) => handleInputChange('personal', 'password', e.target.value)}
                      />
                    </div>
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
                        value={formData.personal.confirmPassword}
                        onChange={(e) => handleInputChange('personal', 'confirmPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-start">
                    <input 
                      id="personal-agree" 
                      type="checkbox" 
                      className="h-4 w-4 mt-1 text-primary focus:ring-primary/30 border-neutral-300 rounded"
                      checked={formData.personal.agree}
                      onChange={(e) => handleInputChange('personal', 'agree', e.target.checked)}
                    />
                    <label htmlFor="personal-agree" className="ml-2 text-sm text-neutral-600">
                      我已阅读并同意<a href="#" className="text-primary hover:underline">《用户服务协议》</a>和<a href="#" className="text-primary hover:underline">《隐私政策》</a>
                    </label>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={handlePersonalRegister}
                >
                  注册
                </button>
              </div>
            )}
            
            {/* 机构注册表单 */}
            {activeTab === 'organization' && (
              <div className="register-content active">
                <div className="mb-6">
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
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">统一社会信用代码</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-id-card-o text-neutral-400"></i>
                    </div>
                    <input 
                      type="text" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入18位统一社会信用代码"
                      value={formData.organization.code}
                      onChange={(e) => handleInputChange('organization', 'code', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">机构类型</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-sitemap text-neutral-400"></i>
                    </div>
                    <select 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom appearance-none"
                      value={formData.organization.type}
                      onChange={(e) => handleInputChange('organization', 'type', e.target.value)}
                    >
                      <option value="">请选择机构类型</option>
                      <option value="school">学校</option>
                      <option value="training">培训机构</option>
                      <option value="enterprise">企业</option>
                      <option value="other">其他</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="fa fa-chevron-down text-neutral-400"></i>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">联系人姓名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-user-plus text-neutral-400"></i>
                    </div>
                    <input 
                      type="text" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入联系人姓名"
                      value={formData.organization.contact}
                      onChange={(e) => handleInputChange('organization', 'contact', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">联系电话</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-phone text-neutral-400"></i>
                    </div>
                    <input 
                      type="tel" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入联系电话"
                      value={formData.organization.phone}
                      onChange={(e) => handleInputChange('organization', 'phone', e.target.value)}
                    />
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
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请输入电子邮箱"
                      value={formData.organization.email}
                      onChange={(e) => handleInputChange('organization', 'email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">管理员用户名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa fa-user-o text-neutral-400"></i>
                    </div>
                    <input 
                      type="text" 
                      className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                      placeholder="请设置管理员用户名"
                      value={formData.organization.username}
                      onChange={(e) => handleInputChange('organization', 'username', e.target.value)}
                    />
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
                        className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                        placeholder="请设置密码"
                        value={formData.organization.password}
                        onChange={(e) => handleInputChange('organization', 'password', e.target.value)}
                      />
                    </div>
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
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-start">
                    <input 
                      id="org-agree" 
                      type="checkbox" 
                      className="h-4 w-4 mt-1 text-primary focus:ring-primary/30 border-neutral-300 rounded"
                      checked={formData.organization.agree}
                      onChange={(e) => handleInputChange('organization', 'agree', e.target.checked)}
                    />
                    <label htmlFor="org-agree" className="ml-2 text-sm text-neutral-600">
                      我已阅读并同意<a href="#" className="text-primary hover:underline">《用户服务协议》</a>和<a href="#" className="text-primary hover:underline">《隐私政策》</a>
                    </label>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={handleOrganizationRegister}
                >
                  注册
                </button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-neutral-500">
                已有账号? <button onClick={onBackToLogin} className="text-primary hover:text-primary/80 transition-custom font-medium">立即登录</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 