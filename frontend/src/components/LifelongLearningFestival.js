import React from 'react';
import { Link } from 'react-router-dom';

const LifelongLearningFestival = () => {
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
        <img src="https://picsum.photos/1200/400?random=2" alt="终身学习节banner" className="w-full h-64 object-cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">终身学习节</h1>
                <p className="text-white mt-2 text-lg">永不停止学习的脚步，让知识伴随终身</p>
            </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-purple-500 pl-4">活动理念</h2>
            <p className="text-gray-700 leading-relaxed">
              “终身学习节” 旨在传递 “学习不止于校园，不限定年龄” 的理念，鼓励每一个人把学习融入日常，成为一种生活方式。无论你是职场新人想提升技能，还是退休长者想丰富生活，都能在这个节日里找到学习的乐趣与价值，让知识持续滋养人生。
            </p>

            <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-800 border-l-4 border-purple-500 pl-4">活动内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-800">线上学习盛宴</h3>
                <p className="text-gray-600">
                  海量免费学习资源开放，涵盖文学、艺术、科技、生活等多领域课程，随时开启知识充电。
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-800">学习打卡挑战</h3>
                <p className="text-gray-600">
                  参与学习打卡活动，坚持学习赢取学习礼包、定制勋章，让学习更有动力。
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-800">专家直播分享</h3>
                <p className="text-gray-600">
                  邀请各领域专家开展直播讲座，解答学习困惑，分享前沿知识与学习方法。
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-800">线下交流沙龙</h3>
                <p className="text-gray-600">
                  举办小型学习交流聚会，让学习者面对面交流心得、碰撞思维火花。
                </p>
              </div>
            </div>

             <div className="text-center mt-10">
                <button className="px-8 py-3 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-600 transition duration-300">加入学习节</button>
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

export default LifelongLearningFestival;