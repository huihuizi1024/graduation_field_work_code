import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewLogin.css';

const NewLogin = () => {
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginType, setLoginType] = useState('password'); // 'password' 或 'phone'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 身份卡片数据
  const identityData = {
    student: {
      title: "学生登录",
      subtitle: "请输入您的账号和密码",
      icon: "fa-user-circle",
      color: "primary",
      route: "/student",
      loginType: "password" // 学生使用账号密码登录
    },
    expert: {
      title: "专家登录",
      subtitle: "请输入您的手机号和验证码",
      icon: "fa-user-o",
      color: "secondary",
      route: "/expert",
      loginType: "phone" // 专家使用手机号登录
    },
    admin: {
      title: "管理员登录",
      subtitle: "请输入您的手机号和验证码",
      icon: "fa-cog",
      color: "tertiary",
      route: "/admin",
      loginType: "phone" // 管理员使用手机号登录
    },
    organization: {
      title: "机构登录",
      subtitle: "请输入您的手机号和验证码",
      icon: "fa-building",
      color: "accent",
      route: "/institution",
      loginType: "phone" // 机构使用手机号登录
    }
  };

  // 处理身份选择
  const handleIdentitySelect = (identity) => {
    setSelectedIdentity(identity);
    setLoginType(identityData[identity].loginType); // 根据身份设置登录方式
    setShowLoginForm(true);
    // 滚动到登录表单
    setTimeout(() => {
      const loginForm = document.getElementById('login-form-container');
      if (loginForm) {
        loginForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // 返回身份选择
  const handleBackToIdentity = () => {
    setShowLoginForm(false);
    setSelectedIdentity(null);
    setUsername('');
    setPassword('');
    setPhone('');
    setVerifyCode('');
    setShowPassword(false);
    setRememberMe(false);
    setLoginType('password');
    
    // 滚动到身份选择
    setTimeout(() => {
      const identitySelection = document.getElementById('identity-selection');
      if (identitySelection) {
        identitySelection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 发送验证码
  const sendVerifyCode = () => {
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    
    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert('请输入正确的手机号');
      return;
    }

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    alert('验证码已发送');
  };

  // 处理登录
  const handleLogin = async () => {
    if (loginType === 'password') {
      if (!username || !password) {
        alert('请输入用户名和密码');
        return;
      }
    } else {
      if (!phone || !verifyCode) {
        alert('请输入手机号和验证码');
        return;
      }
    }

    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      alert('登录成功！正在跳转...');
      
      // 根据选择的身份跳转到相应页面
      if (selectedIdentity && identityData[selectedIdentity]) {
        navigate(identityData[selectedIdentity].route);
      }
    }, 1500);
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mr-3 shadow-lg">
                <i className="fa fa-graduation-cap text-xl"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                学分银行系统
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom font-medium">首页</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom font-medium">关于我们</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom font-medium">帮助中心</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-custom font-medium">联系我们</a>
            </nav>
            <div className="md:hidden">
              <button className="text-neutral-600 focus:outline-none hover:text-primary transition-custom">
                <i className="fa fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-6xl">
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              欢迎使用学分银行系统
            </h1>
            <p className="text-neutral-600 text-lg max-w-3xl mx-auto leading-relaxed">
              选择您的身份进行登录，获取个性化的学习服务和管理功能，开启您的终身学习之旅
            </p>
          </div>
          
          {/* 身份选择区 */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 ${showLoginForm ? 'hidden' : ''}`}
            id="identity-selection"
          >
            {/* 学生身份 */}
            <div 
              className="identity-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => handleIdentitySelect('student')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center text-primary mb-6 mx-auto shadow-lg">
                <i className="fa fa-user-circle text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-neutral-800">学生</h3>
              <p className="text-neutral-600 text-center mb-6 leading-relaxed">管理个人学习档案，查询学分，兑换证书</p>
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  点击登录
                </span>
              </div>
            </div>
            
            {/* 专家身份 */}
            <div 
              className="identity-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => handleIdentitySelect('expert')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-teal-600/20 flex items-center justify-center text-secondary mb-6 mx-auto shadow-lg">
                <i className="fa fa-user-o text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-neutral-800">专家</h3>
              <p className="text-neutral-600 text-center mb-6 leading-relaxed">课程评估，学分认证，学术指导</p>
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-secondary to-teal-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  点击登录
                </span>
              </div>
            </div>
            
            {/* 管理员身份 */}
            <div 
              className="identity-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => handleIdentitySelect('admin')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tertiary/20 to-purple-600/20 flex items-center justify-center text-tertiary mb-6 mx-auto shadow-lg">
                <i className="fa fa-cog text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-neutral-800">管理员</h3>
              <p className="text-neutral-600 text-center mb-6 leading-relaxed">系统管理，用户审核，数据维护</p>
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-tertiary to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  点击登录
                </span>
              </div>
            </div>
            
            {/* 机构身份 */}
            <div 
              className="identity-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => handleIdentitySelect('organization')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-orange-600/20 flex items-center justify-center text-accent mb-6 mx-auto shadow-lg">
                <i className="fa fa-building text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-neutral-800">机构</h3>
              <p className="text-neutral-600 text-center mb-6 leading-relaxed">上传课程，管理学员，合作交流</p>
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-accent to-orange-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  点击登录
                </span>
              </div>
            </div>
          </div>
          
          {/* 登录表单区 */}
          <div 
            className={`bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto fade-in border border-white/20 ${showLoginForm ? '' : 'hidden'}`}
            id="login-form-container"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center text-primary mb-6 mx-auto shadow-lg">
                <i className={`fa ${selectedIdentity ? identityData[selectedIdentity]?.icon : 'fa-sign-in'} text-4xl`}></i>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3">
                {selectedIdentity ? identityData[selectedIdentity]?.title : '登录'}
              </h2>
              <p className="text-neutral-600 text-lg">
                {selectedIdentity ? identityData[selectedIdentity]?.subtitle : '请输入您的账号和密码'}
              </p>
            </div>

            {/* 登录方式切换 - 只在学生登录时显示 */}
            {selectedIdentity === 'student' && (
              <div className="flex bg-neutral-100/50 rounded-xl p-1 mb-8 backdrop-blur-sm">
                <button
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    loginType === 'password' 
                      ? 'bg-white text-primary shadow-lg transform scale-105' 
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                  onClick={() => setLoginType('password')}
                >
                  <i className="fa fa-user mr-2"></i>
                  账号密码登录
                </button>
                <button
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    loginType === 'phone' 
                      ? 'bg-white text-primary shadow-lg transform scale-105' 
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                  onClick={() => setLoginType('phone')}
                >
                  <i className="fa fa-mobile mr-2"></i>
                  手机验证码登录
                </button>
              </div>
            )}
            
            {/* 账号密码登录表单 - 仅学生可用 */}
            {loginType === 'password' && selectedIdentity === 'student' && (
              <>
                <div className="mb-6">
                  <label htmlFor="username" className="block text-sm font-semibold text-neutral-700 mb-3">
                    用户名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fa fa-user text-neutral-400 text-lg"></i>
                    </div>
                    <input 
                      type="text" 
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="form-input block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-white/50 backdrop-blur-sm" 
                      placeholder="请输入用户名"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-3">
                    密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fa fa-lock text-neutral-400 text-lg"></i>
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="form-input block w-full pl-12 pr-12 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-white/50 backdrop-blur-sm" 
                      placeholder="请输入密码"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary transition-colors" 
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-neutral-400 text-lg`}></i>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 手机验证码登录表单 - 专家、管理员、机构使用 */}
            {loginType === 'phone' && (
              <>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-3">
                    手机号
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fa fa-mobile text-neutral-400 text-lg"></i>
                    </div>
                    <input 
                      type="tel" 
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="form-input block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-white/50 backdrop-blur-sm" 
                      placeholder="请输入手机号"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="verifyCode" className="block text-sm font-semibold text-neutral-700 mb-3">
                    验证码
                  </label>
                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa fa-shield text-neutral-400 text-lg"></i>
                      </div>
                      <input 
                        type="text" 
                        id="verifyCode"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="form-input block w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 bg-white/50 backdrop-blur-sm" 
                        placeholder="请输入验证码"
                      />
                    </div>
                    <button
                      onClick={sendVerifyCode}
                      disabled={countdown > 0}
                      className="px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl font-medium"
                    >
                      {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                    </button>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-primary focus:ring-primary/30 border-neutral-300 rounded-lg"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-neutral-600 font-medium">
                  记住我
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-blue-600 transition-colors font-medium">
                忘记密码?
              </a>
            </div>
            
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-3"></i> 登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-neutral-600 font-medium">
                还没有账号? <a href="#" className="text-primary hover:text-blue-600 transition-colors font-semibold">立即注册</a>
              </p>
            </div>
            
            <div className="mt-10 pt-8 border-t border-neutral-200/50">
              <p className="text-center text-neutral-600 mb-6 font-medium">其他登录方式</p>
              <div className="flex justify-center space-x-6">
                <button className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                  <i className="fa fa-weixin text-xl"></i>
                </button>
                <button className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                  <i className="fa fa-qq text-xl"></i>
                </button>
                <button className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                  <i className="fa fa-weibo text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={handleBackToIdentity}
                className="text-primary hover:text-blue-600 transition-colors flex items-center justify-center mx-auto font-medium hover:scale-105 transform transition-all duration-300"
              >
                <i className="fa fa-arrow-left mr-2"></i> 返回身份选择
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewLogin; 