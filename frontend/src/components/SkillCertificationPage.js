import React from 'react';

const SkillCertificationPage = ({ onBackToMain }) => (
  <div className="font-inter text-neutral-800 bg-white min-h-screen">
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center" onClick={e => {e.preventDefault(); onBackToMain();}}>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
            <i className="fa fa-graduation-cap"></i>
          </div>
          <span className="text-xl font-bold">技能认证</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackToMain();}}>首页</a>
          <a href="#process" className="text-neutral-700 hover:text-primary">认证流程</a>
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
    {/* 认证流程 */}
    <section id="process" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">认证流程</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-3">
              1
            </div>
            <div className="font-medium">选择认证</div>
          </div>
          <div className="h-8 w-8 md:w-24 border-t-4 border-primary md:mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mb-3">
              2
            </div>
            <div className="font-medium">提交材料</div>
          </div>
          <div className="h-8 w-8 md:w-24 border-t-4 border-primary md:mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold mb-3">
              3
            </div>
            <div className="font-medium">审核评估</div>
          </div>
          <div className="h-8 w-8 md:w-24 border-t-4 border-primary md:mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-neutral-400 flex items-center justify-center text-white text-2xl font-bold mb-3">
              4
            </div>
            <div className="font-medium">获取证书</div>
          </div>
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
    {/* 为什么选择技能认证 */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">为什么选择技能认证</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-certificate text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">权威认证</h3>
            <p className="text-neutral-600">获得行业认可的权威证书，提升职业竞争力</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-users text-secondary text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">多样选择</h3>
            <p className="text-neutral-600">覆盖IT、数据、设计等多个领域，满足不同发展需求</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-lightbulb-o text-accent text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">实用导向</h3>
            <p className="text-neutral-600">注重实战能力，认证内容紧贴行业实际</p>
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
              <span className="text-xl font-bold">技能认证</span>
            </div>
            <p className="text-neutral-400 mb-4">我们提供多样化的职业技能认证，助你提升专业能力，获得更好发展。</p>
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
              <li><a href="#process" className="text-neutral-400 hover:text-white transition-custom">认证流程</a></li>
              <li><a href="#certs" className="text-neutral-400 hover:text-white transition-custom">认证项目</a></li>
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
            <p className="text-neutral-400 mb-4">订阅我们的邮件，获取最新认证信息</p>
            <form className="flex">
              <input type="email" placeholder="你的邮箱地址" className="px-4 py-2 rounded-l-md w-full focus:outline-none text-neutral-800" />
              <button type="submit" className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary/90 transition-custom">订阅</button>
            </form>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-10 pt-6 text-center text-neutral-400">
          <p>&copy; 2025 技能认证. 保留所有权利.</p>
        </div>
      </div>
    </footer>
    {/* 引入FontAwesome CDN */}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" />
  </div>
);

export default SkillCertificationPage; 
