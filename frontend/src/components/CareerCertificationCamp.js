import React from 'react';
import { Link } from 'react-router-dom';

const CareerCertificationCamp = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">知学教育</Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">首页</Link>
            <Link to="/#activities" className="text-gray-600 hover:text-gray-800">活动专题</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-800">联系我们</Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <img src="https://picsum.photos/1200/400?random=4" alt="职业认证冲刺营" className="w-full h-64 object-cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">职业认证冲刺营</h1>
            <p className="text-white mt-2 text-lg">聚焦热门证书，60天高效备考冲刺</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-yellow-500 pl-4">活动目标</h2>
          <p className="text-gray-700 leading-relaxed">
            针对 <strong>CPA、PMP、教师资格证</strong> 等热门职业认证，打造「60天冲刺计划」。从考点拆解、高频错题训练，到全真模拟考试，帮你高效攻克难点，大幅提升通过率！
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-yellow-500 pl-4">核心服务</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-yellow-800">定制化学习包</h3>
              <p className="text-gray-600">
                包含 <strong>考点速记手册、历年真题精讲、专属错题本</strong>，精准覆盖考试核心内容。
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-yellow-800">1v1 督学服务</h3>
              <p className="text-gray-600">
                专属班主任每日打卡提醒，每周学习复盘，解决「拖延症 + 知识盲点」双重难题。
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-yellow-800">全真模考系统</h3>
              <p className="text-gray-600">
                还原考试场景，自动生成 <strong>错题分析报告 + 提分建议</strong>，考前精准查漏补缺。
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-yellow-800">证书价值解读</h3>
              <p className="text-gray-600">
                邀请持证学长分享「证书对职场晋升、薪资涨幅的真实影响」，清晰规划职业路径。
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-full hover:bg-yellow-600 transition duration-300">立即报名</button>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-inner mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; 2025 知学教育 版权所有 | 联系电话：400-xxxx-xxxx
        </div>
      </footer>
    </div>
  );
};

export default CareerCertificationCamp; 