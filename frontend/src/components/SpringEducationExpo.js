import React from 'react';
import { Link } from 'react-router-dom';

const SpringEducationExpo = () => {
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
        <img src="https://picsum.photos/1200/400?random=1" alt="2024春季教育展banner" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">2024春季教育展</h1>
                <p className="text-white mt-2 text-lg">探索更多学习机会，开启你的学习之旅</p>
            </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">活动简介</h2>
            <p className="text-gray-700 leading-relaxed">
              2024春季教育展重磅来袭！汇聚众多优质教育资源，涵盖学历提升、职业技能培训、兴趣学习等多元领域。无论你是想提升职场竞争力，还是拓展知识视野，都能在这里找到适配的学习路径。现场将有教育专家分享会、热门专业咨询、学习成果展示等精彩环节，助力你开启全新学习篇章，别错过这场学习盛宴！
            </p>

            <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">活动亮点</h2>
            <ul className="text-gray-700 list-disc list-inside pl-2 space-y-3">
              <li>多所知名院校参展，面对面咨询学历提升方案</li>
              <li>热门职业技能课程体验，提前感受学习内容</li>
              <li>学习达人分享会，获取高效学习经验</li>
              <li>专属活动福利，报名课程享优惠</li>
            </ul>

            <div className="text-center mt-10">
                <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition duration-300">立即参与</button>
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

export default SpringEducationExpo; 