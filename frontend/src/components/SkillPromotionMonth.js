import React from 'react';
import { Link } from 'react-router-dom';

const SkillPromotionMonth = () => {
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
        <img src="https://picsum.photos/1200/400?random=3" alt="技能提升月banner" className="w-full h-64 object-cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">技能提升月</h1>
            <p className="text-white mt-2 text-lg">提升职场竞争力，助力职业发展</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-4">活动背景</h2>
          <p className="text-gray-700 leading-relaxed">
            在快速发展的职场环境中，持续提升技能是保持竞争力的关键。"技能提升月" 聚焦职场热门技能，为广大职场人、求职者打造专属学习提升通道，提供实用课程与专业指导，帮你突破职业瓶颈，实现职业进阶。
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-green-500 pl-4">核心技能课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg shadow transition-transform transform hover:-translate-y-2">
              <img src="https://picsum.photos/200/150?random=4" alt="课程1" className="w-full h-32 object-cover rounded-md mb-4"/>
              <h3 className="text-xl font-bold mb-2 text-green-800">Python编程基础</h3>
              <p className="text-gray-600">
                掌握Python基础语法，学会数据处理与简单程序开发，为数据分析、自动化办公等赋能。
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow transition-transform transform hover:-translate-y-2">
              <img src="https://picsum.photos/200/150?random=5" alt="课程2" className="w-full h-32 object-cover rounded-md mb-4"/>
              <h3 className="text-xl font-bold mb-2 text-green-800">职场沟通技巧</h3>
              <p className="text-gray-600">
                提升沟通表达、团队协作、谈判技巧，让你在职场交流中游刃有余。
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow transition-transform transform hover:-translate-y-2">
              <img src="https://picsum.photos/200/150?random=6" alt="课程3" className="w-full h-32 object-cover rounded-md mb-4"/>
              <h3 className="text-xl font-bold mb-2 text-green-800">短视频运营实战</h3>
              <p className="text-gray-600">
                学习短视频策划、拍摄、剪辑及运营推广，抓住新媒体营销风口。
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-green-500 pl-4">活动特色</h2>
          <ul className="text-gray-700 list-disc list-inside pl-2 space-y-3">
            <li>课程由行业资深专家授课，理论 + 实战结合</li>
            <li>提供学习社群服务，课后答疑、作业交流更便捷</li>
            <li>完成课程学习可获得电子学习证书，助力简历加分</li>
          </ul>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition duration-300">立即提升</button>
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

export default SkillPromotionMonth; 