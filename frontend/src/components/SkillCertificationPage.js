import React from 'react';
import { useNavigate } from 'react-router-dom';

const SkillCertificationPage = ({ onBackToMain }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackToMain) {
      onBackToMain();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="font-inter text-neutral-800 bg-white min-h-screen">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#" className="flex items-center" onClick={e => {e.preventDefault(); handleBack();}}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
              <i className="fa fa-graduation-cap"></i>
            </div>
            <span className="text-xl font-bold">技能认证</span>
          </a>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); handleBack();}}>首页</a>
            <a href="#certs" className="text-neutral-700 hover:text-primary">认证项目</a>
          </nav>
          <button className="md:hidden text-neutral-700">
            <i className="fa fa-bars text-xl"></i>
          </button>
        </div>
      </header>
      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">职业技能认证<br />提升你的专业竞争力</h1>
            <p className="text-lg mb-8">通过权威认证，展示你的技能水平，助力职业发展</p>
            <a href="#certs" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-custom">
              查看认证项目
            </a>
          </div>
        </div>
      </section>
      {/* 认证项目 */}
      <section id="certs" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">热门认证项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 认证1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=cert1" alt="Web前端开发工程师" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">Web前端开发工程师</h3>
                <p className="text-neutral-600 text-sm mb-4">掌握HTML5、CSS3、JavaScript等前端技术，能够独立完成响应式网站和Web应用开发。</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥299</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即申请</a>
                </div>
              </div>
            </div>
            {/* 认证2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=cert2" alt="大数据分析师" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">大数据分析师</h3>
                <p className="text-neutral-600 text-sm mb-4">掌握Hadoop、Spark等大数据技术，能够进行数据挖掘、分析和可视化，提供数据驱动决策支持。</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥499</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即申请</a>
                </div>
              </div>
            </div>
            {/* 认证3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=cert3" alt="Java开发工程师" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">Java开发工程师</h3>
                <p className="text-neutral-600 text-sm mb-4">掌握Java核心技术、Spring框架、微服务架构等，能够设计和开发大型企业级应用系统。</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥599</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即申请</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 引入FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" />
    </div>
  );
};

export default SkillCertificationPage; 
