import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../api';
import api from '../api';

const Login = ({ onLoginSuccess, onGoToRegister }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentIdentity, setCurrentIdentity] = useState(null);
  const [activeTab, setActiveTab] = useState('password');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const identityData = {
    student: { title: "学生登录", subtitle: "请选择登录方式", icon: "fa-user-circle", color: "primary" },
    expert: { title: "专家登录", subtitle: "请选择登录方式", icon: "fa-user-tie", color: "secondary" },
    admin: { title: "管理员登录", subtitle: "请选择登录方式", icon: "fa-cog", color: "tertiary" },
    organization: { title: "机构登录", subtitle: "请选择登录方式", icon: "fa-building", color: "accent" }
  };


  const handleIdentityClick = (identity) => {
    setCurrentIdentity(identity);
    setShowLoginForm(true);
    setActiveTab('password');
  };

  const handleBackClick = () => {
    if (showLoginForm) {
      setShowLoginForm(false);
      setCurrentIdentity(null);
    } else {
      navigate('/');
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

    const [loginError, setLoginError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        if (isLoggingIn) return;
        
        try {
            setIsLoggingIn(true);
            setLoginError(null);
            
            if (!username || !password) {
                throw new Error('请输入用户名和密码');
            }

            console.log('Sending login request with:', { username, password });
            const response = await login(username, password, currentIdentity);
            console.log('Login response:', response);
            
            // 检查响应状态 - 后端直接返回数据，我们检查关键字段是否存在
            if (response && response.token && response.user) {
                // 存储简单认证标记
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', response.user.username); // 使用返回的用户名
                localStorage.setItem('role', response.user.role.toString()); // 使用返回的角色
                localStorage.setItem('userInfo', JSON.stringify(response.user));
                if (response.token) {
                  localStorage.setItem('token', response.token);
                }
            } else {
                // 如果后端返回的格式不符合预期，也视为登录失败
                throw new Error(response?.message || '登录响应格式不正确');
            }


            // Redirect user based on role
            if (response.user.role === 4) { // 4 is for admin
                navigate('/admin');
            } else {
                navigate('/');
            }

            } catch (error) {
                console.error('登录失败:', error);
                setLoginError(
                    error.response?.status === 400 
                    ? '身份不匹配或账号密码有误'
                    : error.response?.data?.message ||
                      error.message ||
                      '登录失败，请检查用户名和密码'
                );

        } finally {
            setIsLoggingIn(false);
        }
    };

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    if (passwordInput && toggleButton) {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      if (type === 'password') {
        toggleButton.innerHTML = '<i class="fa fa-eye text-neutral-400"></i>';
      } else {
        toggleButton.innerHTML = '<i class="fa fa-eye-slash text-neutral-400"></i>';
      }
    }
  };

  // 添加点击事件监听器
  React.useEffect(() => {
    const toggleButton = document.getElementById('toggle-password');
    if (toggleButton) {
      toggleButton.addEventListener('click', togglePasswordVisibility);
      return () => {
        toggleButton.removeEventListener('click', togglePasswordVisibility);
      };
    }
  }, []);

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
              <button onClick={handleBackClick} className="text-neutral-600 hover:text-primary transition-custom">返回主页</button>
              <button className="text-neutral-600 hover:text-primary transition-custom">关于我们</button>
              <button className="text-neutral-600 hover:text-primary transition-custom">帮助中心</button>
              <button className="text-neutral-600 hover:text-primary transition-custom">联系我们</button>
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
        <div className="container mx-auto max-w-6xl">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-neutral-700 mb-4">欢迎使用学分银行系统</h1>
            <p className="text-neutral-500 text-lg max-w-2xl mx-auto">选择您的身份进行登录，获取个性化的学习服务和管理功能</p>
          </div>

          {/* 身份选择区 */}
          {!showLoginForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* 学生身份 */}
              <div className="identity-card bg-white rounded-xl shadow-md p-8 border-t-4 border-primary" onClick={() => handleIdentityClick('student')}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto">
                  <i className="fa fa-user-circle text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">学生</h3>
                <p className="text-neutral-500 text-center mb-6">管理个人学习档案，查询学分，兑换证书</p>
                <div className="text-center">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    点击登录
                  </span>
                </div>
              </div>

              {/* 专家身份 */}
              <div className="identity-card bg-white rounded-xl shadow-md p-8 border-t-4 border-secondary" onClick={() => handleIdentityClick('expert')}>
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6 mx-auto">
                  <i className="fa fa-user-o text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">专家</h3>
                <p className="text-neutral-500 text-center mb-6">课程评估，学分认证，学术指导</p>
                <div className="text-center">
                  <span className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
                    点击登录
                  </span>
                </div>
              </div>

              {/* 管理员身份 */}
              <div className="identity-card bg-white rounded-xl shadow-md p-8 border-t-4 border-tertiary" onClick={() => handleIdentityClick('admin')}>
                <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-6 mx-auto">
                  <i className="fa fa-cog text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">管理员</h3>
                <p className="text-neutral-500 text-center mb-6">系统管理，用户审核，数据维护</p>
                <div className="text-center">
                  <span className="inline-block bg-tertiary/10 text-tertiary px-4 py-2 rounded-full text-sm font-medium">点击登录</span>
                </div>
              </div>

              {/* 机构身份 */}
              <div className="identity-card bg-white rounded-xl shadow-md p-8 border-t-4 border-accent" onClick={() => handleIdentityClick('organization')}>
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 mx-auto">
                  <i className="fa fa-building text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">机构</h3>
                <p className="text-neutral-500 text-center mb-6">上传课程，管理学员，合作交流</p>
                <div className="text-center">
                  <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">点击登录</span>
                </div>
              </div>
            </div>
          )}

          {/* 登录表单区 */}
          {showLoginForm && (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 mx-auto">
                  <i className={`fa ${identityData[currentIdentity]?.icon} text-3xl`}></i>
                </div>
                <h2 className="text-2xl font-bold text-neutral-700 mb-2">{identityData[currentIdentity]?.title}</h2>
                <p className="text-neutral-500">{identityData[currentIdentity]?.subtitle}</p>
              </div>

              {/* 登录方式切换 */}
              <div className="login-tabs">
                <div 
                  className={`login-tab ${activeTab === 'password' ? 'tab-active' : ''}`} 
                  onClick={() => handleTabClick('password')}
                >
                  账号密码登录
                </div>
                <div 
                  className={`login-tab ${activeTab === 'phone' ? 'tab-active' : ''}`} 
                  onClick={() => handleTabClick('phone')}
                >
                  手机号登录
                </div>
              </div>

              {/* 账号密码登录 */}
              {activeTab === 'password' && (
                <div className="login-content active">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-600 mb-2">用户名</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa fa-user-o text-neutral-400"></i>
                      </div>
                      <input 
                        id="username"
                        type="text" 
                        className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                        placeholder="请输入用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-600 mb-2">密码</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa fa-lock text-neutral-400"></i>
                      </div>
                      <input 
                        id="password"
                        type="password" 
                        className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" 
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button id="toggle-password" type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <i className="fa fa-eye text-neutral-400"></i>
                      </button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-neutral-500">
                    <span>还没有账号？</span>
                    <button 
                      onClick={() => navigate('/register')}
                      className="text-primary hover:underline font-medium focus:outline-none"
                    >
                      立即注册
                    </button>
                  </div>
                </div>
              )}

              {/* 手机号登录 */}
              {activeTab === 'phone' && (
                <div className="login-content active">
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-600 mb-2">手机号</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa fa-mobile text-neutral-400"></i>
                      </div>
                      <input type="tel" id="phone" className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" placeholder="请输入手机号" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="verify-code" className="block text-sm font-medium text-neutral-600 mb-2">验证码</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa fa-key text-neutral-400"></i>
                        </div>
                        <input type="text" id="verify-code" className="form-input block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-custom" placeholder="请输入验证码" />
                      </div>
                      <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-custom">
                        获取验证码
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-neutral-600">记住我</label>
                </div>
                <div className="text-sm">
                  <button className="text-primary hover:text-primary-dark">忘记密码？</button>
                </div>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base hover:bg-primary/90 transition-custom focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? '正在登录...' : '安全登录'}
                </button>
                <button onClick={handleBackClick} className="w-full bg-neutral-100 text-neutral-600 py-3 rounded-lg hover:bg-neutral-200 transition-custom font-medium">
                  返回
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-neutral-500">
                还没有账号？ <button className="text-primary hover:text-primary-dark font-medium">立即注册</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
