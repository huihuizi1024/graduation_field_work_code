import React from 'react';

const LifeSkillsPage = ({ onBackToMain }) => (
  <div className="font-inter text-neutral-800 bg-white min-h-screen">
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center" onClick={e => {e.preventDefault(); onBackToMain();}}>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
            <i className="fa fa-home"></i>
          </div>
          <span className="text-xl font-bold">生活技能培训</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackToMain();}}>首页</a>
          <a href="#categories" className="text-neutral-700 hover:text-primary">技能分类</a>
          <a href="#popular" className="text-neutral-700 hover:text-primary">热门课程</a>
          <a href="#testimonials" className="text-neutral-700 hover:text-primary">学员评价</a>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">掌握生活技能<br />提升生活品质</h1>
          <p className="text-lg mb-8">我们提供实用的生活技能培训，帮助你独立应对生活中的各种挑战</p>
          <a href="#popular" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-custom">浏览课程</a>
        </div>
      </div>
    </section>
    {/* 技能分类 */}
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">生活技能分类</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 烹饪美食 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=cooking" alt="烹饪美食" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">烹饪美食</h3>
              <p className="text-neutral-600 text-sm mb-3">学习各类美食制作方法</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 家居整理 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=organize" alt="家居整理" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">家居整理</h3>
              <p className="text-neutral-600 text-sm mb-3">学习空间规划与收纳技巧</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 手工DIY */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=diy" alt="手工DIY" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">手工DIY</h3>
              <p className="text-neutral-600 text-sm mb-3">学习手工制作与创意设计</p>
              <a href="#" className="text-primary font-medium text-sm">查看全部</a>
            </div>
          </div>
          {/* 基础维修 */}
          <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=repair" alt="基础维修" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">基础维修</h3>
              <p className="text-neutral-600 text-sm mb-3">学习家电与家具基础维修</p>
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
            <img src="https://picsum.photos/600/400?random=c1" alt="家常菜烹饪入门" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t1" alt="陈老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">陈老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">家常菜烹饪入门</h3>
              <p className="text-neutral-600 text-sm mb-4">学习30道家常菜品的制作方法</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥199</span>
                <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
              </div>
            </div>
          </div>
          {/* 课程2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=c2" alt="家居收纳技巧" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t2" alt="林老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">林老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">家居收纳技巧</h3>
              <p className="text-neutral-600 text-sm mb-4">让你的家焕然一新的收纳秘诀</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥249</span>
                <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
              </div>
            </div>
          </div>
          {/* 课程3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src="https://picsum.photos/600/400?random=c3" alt="手工皮具制作" className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center mb-3">
                <img src="https://picsum.photos/100/100?random=t3" alt="王老师" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-neutral-600">王老师</span>
              </div>
              <h3 className="text-xl font-bold mb-2">手工皮具制作</h3>
              <p className="text-neutral-600 text-sm mb-4">从零开始制作实用皮具</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-lg">¥299</span>
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
              <i className="fa fa-certificate text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">专业认证</h3>
            <p className="text-neutral-600">所有课程均由专业老师精心设计</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-video-camera text-secondary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">视频教程</h3>
            <p className="text-neutral-600">高清视频教程，可反复观看学习</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-comments text-accent text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">在线指导</h3>
            <p className="text-neutral-600">专业老师在线解答学习疑问</p>
          </div>
        </div>
      </div>
    </section>
    {/* 学员评价 */}
    <section id="testimonials" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">学员评价</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 评价1 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4">
              <img src="https://picsum.photos/100/100?random=u1" alt="张女士" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">张女士</h4>
                <div className="flex text-yellow-400">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-600">"参加了家常菜烹饪课程后，我现在已经能为家人做出美味的晚餐了，课程内容非常实用，老师讲解也很详细。"</p>
          </div>
          {/* 评价2 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4">
              <img src="https://picsum.photos/100/100?random=u2" alt="李先生" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">李先生</h4>
                <div className="flex text-yellow-400">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star-half-o"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-600">"家居收纳课程真的帮了我大忙，按照老师教的方法整理了我的小公寓，现在空间利用率提高了很多，看起来也整洁多了。"</p>
          </div>
          {/* 评价3 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4">
              <img src="https://picsum.photos/100/100?random=u3" alt="王女士" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">王女士</h4>
                <div className="flex text-yellow-400">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
              </div>
            </div>
            <p className="text-neutral-600">"手工皮具制作课程非常有趣，我学会了制作钱包和钥匙包，还送给了朋友作为礼物，他们都很喜欢。老师很有耐心，会一步步指导。"</p>
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
                <i className="fa fa-home"></i>
              </div>
              <span className="text-xl font-bold">生活技能培训</span>
            </div>
            <p className="text-neutral-400 mb-4">我们提供实用的生活技能培训，帮助你独立应对生活中的各种挑战。</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-facebook"></i></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-instagram"></i></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-custom"><i className="fa fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-custom" onClick={e => {e.preventDefault(); onBackToMain();}}>首页</a></li>
              <li><a href="#categories" className="text-neutral-400 hover:text-white transition-custom">技能分类</a></li>
              <li><a href="#popular" className="text-neutral-400 hover:text-white transition-custom">热门课程</a></li>
              <li><a href="#testimonials" className="text-neutral-400 hover:text-white transition-custom">学员评价</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400"><i className="fa fa-map-marker mr-2"></i><span>上海市浦东新区某某大厦</span></li>
              <li className="flex items-center text-neutral-400"><i className="fa fa-phone mr-2"></i><span>400-567-8910</span></li>
              <li className="flex items-center text-neutral-400"><i className="fa fa-envelope mr-2"></i><span>contact@life-skills.com</span></li>
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
          <p>&copy; 2025 生活技能培训. 保留所有权利.</p>
        </div>
      </div>
    </footer>
    {/* 引入FontAwesome CDN */}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" />
  </div>
);

export default LifeSkillsPage; 