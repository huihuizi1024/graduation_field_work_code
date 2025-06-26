import React from 'react';

const InterestTrainingPage = ({ onBackToMain }) => (
  <div className="font-inter text-neutral-800 bg-white min-h-screen">
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center" onClick={e => {e.preventDefault(); onBackToMain();}}>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
            <i className="fa fa-graduation-cap"></i>
          </div>
          <span className="text-xl font-bold">兴趣培训</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackToMain();}}>首页</a>
          <a href="#categories" className="text-neutral-700 hover:text-primary">课程分类</a>
          <a href="#popular" className="text-neutral-700 hover:text-primary">热门课程</a>
        </nav>
        <button className="md:hidden text-neutral-700">
          <i className="fa fa-bars text-xl"></i>
        </button>
      </div>
    </header>
    {/* 英雄区域 */}
    <section id="home" className="bg-gradient-to-r from-primary to-secondary text-white py-20 pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">发现你的兴趣<br />释放无限潜能</h1>
          <p className="text-lg mb-8">我们提供多样化的兴趣培训课程，帮助你探索新技能，发展个人爱好</p>
          <a href="#popular" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-custom">
            浏览课程
          </a>
        </div>
      </div>
    </section>
    {/* 课程分类 */}
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">探索兴趣领域</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 艺术设计 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=art" alt="艺术设计" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">艺术设计</h3>
              <p className="text-neutral-600 text-sm mb-3">学习绘画、设计等创意技能</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 音乐表演 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=music" alt="音乐表演" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">音乐表演</h3>
              <p className="text-neutral-600 text-sm mb-3">学习乐器演奏、声乐技巧</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 体育运动 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=sports" alt="体育运动" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">体育运动</h3>
              <p className="text-neutral-600 text-sm mb-3">学习各类运动技能</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 科技创新 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=tech" alt="科技创新" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">科技创新</h3>
              <p className="text-neutral-600 text-sm mb-3">学习编程、人工智能等</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* 热门课程 */}
    <section id="popular" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">热门课程推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 课程1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=c1" alt="水彩绘画入门" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t1" alt="张老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">张老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">水彩绘画入门</h3>
              <p className="text-neutral-600 text-sm mb-4">适合零基础的水彩绘画课程</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥299</span>
                <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
              </div>
            </div>
          </div>
          {/* 课程2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=c2" alt="吉他弹唱技巧" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t2" alt="李老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">李老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">吉他弹唱技巧</h3>
              <p className="text-neutral-600 text-sm mb-4">学习流行歌曲弹唱技巧</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥359</span>
                <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
              </div>
            </div>
          </div>
          {/* 课程3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=c3" alt="Python编程基础" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t3" alt="王老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">王老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Python编程基础</h3>
              <p className="text-neutral-600 text-sm mb-4">零基础Python入门课程</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥399</span>
                <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-custom">查看全部课程</a>
        </div>
      </div>
    </section>
    {/* 为什么选择我们 */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-user-circle text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">专业导师</h3>
            <p className="text-neutral-600">拥有丰富教学经验的专业导师团队</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-calendar-check-o text-secondary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">灵活学习</h3>
            <p className="text-neutral-600">线上线下多种学习方式自由选择</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-lightbulb-o text-accent text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">实践导向</h3>
            <p className="text-neutral-600">注重实践操作，快速掌握实用技能</p>
          </div>
        </div>
      </div>
    </section>
    {/* 页脚 */}
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
                <i className="fa fa-graduation-cap"></i>
              </div>
              <span className="text-xl font-bold">兴趣培训</span>
            </div>
            <p className="text-neutral-400 mb-4">我们提供多样化的兴趣培训课程，帮助你探索新技能，发展个人爱好。</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-facebook"></i></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-instagram"></i></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-neutral-400 hover:text-white transition-custom">首页</a></li>
              <li><a href="#categories" className="text-neutral-400 hover:text-white transition-custom">课程分类</a></li>
              <li><a href="#popular" className="text-neutral-400 hover:text-white transition-custom">热门课程</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400"><i className="fa fa-map-marker mr-2"></i><span>北京市朝阳区某某大厦</span></li>
              <li className="flex items-center text-neutral-400"><i className="fa fa-phone mr-2"></i><span>400-123-4567</span></li>
              <li className="flex items-center text-neutral-400"><i className="fa fa-envelope mr-2"></i><span>contact@example.com</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">订阅我们</h4>
            <p className="text-neutral-400 mb-4">订阅我们的邮件，获取最新课程信息</p>
            <form className="flex">
              <input type="email" placeholder="你的邮箱地址" className="px-4 py-2 rounded-l-md w-full focus:outline-none text-neutral-800" />
              <button type="submit" className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary/90 transition-custom">订阅</button>
            </form>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-neutral-400">
          <p>&copy; 2025 兴趣培训. 保留所有权利.</p>
        </div>
      </div>
    </footer>
    {/* 引入FontAwesome CDN */}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" />
  </div>
);

export default InterestTrainingPage; 