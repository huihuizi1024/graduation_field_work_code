import React from 'react';

const EducationPromotionPage = ({ onBackHome }) => (
  <div className="font-inter text-neutral-800">
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center focus:outline-none" onClick={e => {e.preventDefault(); onBackHome();}}>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
            <i className="fa fa-graduation-cap"></i>
          </div>
          <span className="text-xl font-bold">知学教育</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#home" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackHome();}}>首页</a>
          <a href="#programs" className="text-neutral-700 hover:text-primary">学历项目</a>
          <a href="#advantages" className="text-neutral-700 hover:text-primary">我们的优势</a>
          <a href="#contact" className="text-neutral-700 hover:text-primary">联系我们</a>
        </nav>
      </div>
    </header>
    <main className="pt-24">
      {/* 英雄区域 */}
      <section id="home" className="bg-gradient-to-r from-primary to-primary/80 text-white py-20 pt-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">提升学历<br/>开启职业新篇章</h1>
          <p className="text-lg mb-8">专业学历提升方案，助您实现职业目标</p>
          <a href="#programs" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-all">了解项目</a>
        </div>
      </section>
      {/* 数据统计 */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">5000+</div>
              <p className="text-neutral-600 text-sm">毕业学员</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">30+</div>
              <p className="text-neutral-600 text-sm">合作高校</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">100+</div>
              <p className="text-neutral-600 text-sm">热门专业</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <p className="text-neutral-600 text-sm">毕业率</p>
            </div>
          </div>
        </div>
      </section>
      {/* 学历项目 */}
      <section id="programs" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">热门学历项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 项目1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img src="https://picsum.photos/600/400?random=1" alt="高升专" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">高中升专科</h3>
                <p className="text-neutral-600 mb-4">无需高考，轻松获得国家承认专科学历</p>
                <a href="#" className="text-primary font-medium">了解详情</a>
              </div>
            </div>
            {/* 项目2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img src="https://picsum.photos/600/400?random=2" alt="专升本" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">专科升本科</h3>
                <p className="text-neutral-600 mb-4">国家承认本科学历，可考公务员、研究生</p>
                <a href="#" className="text-primary font-medium">了解详情</a>
              </div>
            </div>
            {/* 项目3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img src="https://picsum.photos/600/400?random=3" alt="高升本" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">高中升本科</h3>
                <p className="text-neutral-600 mb-4">一站式本科学历提升方案，省时省力</p>
                <a href="#" className="text-primary font-medium">了解详情</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-all">查看全部项目</a>
          </div>
        </div>
      </section>
      {/* 我们的优势 */}
      <section id="advantages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">我们的优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="fa fa-university text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">名校合作</h3>
              <p className="text-neutral-600">与多所国家重点院校合作，提供优质教学资源</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="fa fa-graduation-cap text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">高毕业率</h3>
              <p className="text-neutral-600">专业辅导，毕业通过率远高于行业平均水平</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="fa fa-certificate text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">国家承认</h3>
              <p className="text-neutral-600">学历证书国家承认，学信网可查</p>
            </div>
          </div>
        </div>
      </section>
      {/* 联系我们 */}
      <section id="contact" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">联系我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-6">联系方式</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <i className="fa fa-map-marker text-primary mt-1 mr-4 w-4 text-center"></i>
                    <span>北京市朝阳区某某大厦10层</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-phone text-primary mt-1 mr-4 w-4 text-center"></i>
                    <span>400-123-4567</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fa fa-envelope text-primary mt-1 mr-4 w-4 text-center"></i>
                    <span>info@zhixueedu.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-6">免费咨询</h3>
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">姓名</label>
                    <input type="text" id="name" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">电话</label>
                    <input type="tel" id="phone" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">咨询内容</label>
                    <textarea id="message" rows="4" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-all">提交咨询</button>
                </form>
              </div>
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
                <span className="text-xl font-bold">知学教育</span>
              </div>
              <p className="text-neutral-400 text-sm mb-4">专业学历提升服务平台</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">学历项目</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">高中升专科</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">专科升本科</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">高中升本科</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">快速链接</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">关于我们</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">院校合作</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-all">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">联系方式</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fa fa-map-marker text-primary mt-1 mr-2"></i>
                  <span className="text-neutral-400">北京市朝阳区某某大厦10层</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-phone text-primary mt-1 mr-2"></i>
                  <span className="text-neutral-400">400-123-4567</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-envelope text-primary mt-1 mr-2"></i>
                  <span className="text-neutral-400">info@zhixueedu.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-neutral-400 text-sm">
            <p>&copy; 2025 知学教育. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </main>
  </div>
);

export default EducationPromotionPage; 