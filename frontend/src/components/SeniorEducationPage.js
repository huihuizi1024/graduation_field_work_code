import React from 'react';

const SeniorEducationPage = ({ onBackHome }) => (
  <div className="font-inter text-neutral-800">
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center focus:outline-none" onClick={e => {e.preventDefault(); onBackHome();}}>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
            <i className="fa fa-user-o"></i>
          </div>
          <span className="text-xl font-bold">老年教育</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#home" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackHome();}}>首页</a>
          <a href="#courses" className="text-neutral-700 hover:text-primary">热门课程</a>
          <a href="#features" className="text-neutral-700 hover:text-primary">特色服务</a>
          <a href="#testimonials" className="text-neutral-700 hover:text-primary">学员反馈</a>
        </nav>
      </div>
    </header>
    <main className="pt-24">
      {/* 英雄区 */}
      <section id="home" className="bg-gradient-to-r from-primary to-secondary text-white py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">银龄学习新生活<br/>乐享智慧晚年</h1>
            <p className="text-lg mb-8">丰富的老年教育课程，助力长者终身成长，健康快乐每一天</p>
            <a href="#courses" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-custom">浏览课程</a>
          </div>
        </div>
      </section>
      {/* 热门课程 */}
      <section id="courses" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">热门老年课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 课程1 */}
            <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=health" alt="健康养生" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">健康养生与运动</h3>
                <p className="text-neutral-600 text-sm mb-4">科学锻炼，健康生活，提升身体素质</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥199</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                </div>
              </div>
            </div>
            {/* 课程2 */}
            <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=art" alt="艺术修养" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">艺术修养与手工</h3>
                <p className="text-neutral-600 text-sm mb-4">书法、绘画、手工等丰富课程，陶冶情操</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥159</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                </div>
              </div>
            </div>
            {/* 课程3 */}
            <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
              <img src="https://picsum.photos/600/400?random=tech" alt="智能科技" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">智能科技与生活</h3>
                <p className="text-neutral-600 text-sm mb-4">智能手机、网络应用，拥抱数字时代</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">¥129</span>
                  <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 特色服务 */}
      <section id="features" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">特色服务</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-heartbeat text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">健康指导</h3>
              <p className="text-neutral-600">专业健康管理师定期讲座，关注长者身心健康</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-users text-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">社交活动</h3>
              <p className="text-neutral-600">丰富的兴趣小组和社交活动，结交新朋友</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-bus text-accent text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">便捷服务</h3>
              <p className="text-neutral-600">提供接送、助餐等贴心服务，学习无忧</p>
            </div>
          </div>
        </div>
      </section>
      {/* 学员反馈 */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">学员反馈</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img src="https://picsum.photos/100/100?random=senior1" alt="王阿姨" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">王阿姨</h4>
                  <p className="text-sm text-neutral-500">退休教师</p>
                  <div className="flex text-yellow-400">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-neutral-600">“参加健康养生课程后，我的身体状况明显改善，还结识了很多新朋友！”</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <img src="https://picsum.photos/100/100?random=senior2" alt="李大爷" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">李大爷</h4>
                  <p className="text-sm text-neutral-500">社区志愿者</p>
                  <div className="flex text-yellow-400">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star-half-o"></i>
                  </div>
                </div>
              </div>
              <p className="text-neutral-600">“智能手机课程让我学会了用微信和家人视频，生活更方便了！”</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default SeniorEducationPage; 