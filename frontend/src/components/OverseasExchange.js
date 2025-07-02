import React from 'react';
import { Link } from 'react-router-dom';

const OverseasExchange = () => {
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
        <img src="https://picsum.photos/1200/400?random=5" alt="海外院校交流会" className="w-full h-64 object-cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">海外院校交流会</h1>
            <p className="text-white mt-2 text-lg">直通海外名校，1v1规划留学路径</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">活动亮点</h2>
          <p className="text-gray-700 leading-relaxed">
            汇聚 <strong>美国、英国、澳洲、新加坡</strong> 等热门留学国家的 <strong>50+ 海外院校</strong>，招生官1v1答疑，涵盖硕士、本科、预科全阶段，帮你精准匹配院校与专业！
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">核心环节</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-blue-800">名校招生官面对面</h3>
              <p className="text-gray-600">
                各院校招生官现场解读 <strong>2025最新录取政策</strong>，剖析「GPA、文书、背景提升」核心要求。
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-blue-800">个性化留学规划</h3>
              <p className="text-gray-600">
                留学顾问根据你的 <strong>学术背景、职业目标</strong>，定制「选校方案 + 时间轴」，避坑冷门申请陷阱。
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-blue-800">留学生活分享会</h3>
              <p className="text-gray-600">
                在读留学生分享 <strong>真实海外学习、生活、求职经历</strong>，提前解锁「留学生存指南」。
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-blue-800">独家申请福利</h3>
              <p className="text-gray-600">
                现场报名享 <strong>文书润色7折、语言培训优惠券</strong>，部分院校 <strong>免申请费</strong> 通道限时开放！
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition duration-300">预约席位</button>
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

export default OverseasExchange; 