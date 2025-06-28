import React, { useEffect } from 'react';

const CareerAdvancePage = ({ onBackToMain }) => {
  useEffect(() => {
    // 导航栏滚动效果
    const handleScroll = () => {
      const navbar = document.querySelector('header');
      if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
      } else {
        navbar.classList.remove('shadow-md');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 平滑滚动
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    };
    anchors.forEach(anchor => anchor.addEventListener('click', handleClick));
    return () => anchors.forEach(anchor => anchor.removeEventListener('click', handleClick));
  }, []);

  return (
    <div className="font-inter text-neutral-800">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#" className="flex items-center focus:outline-none" onClick={e => {e.preventDefault(); onBackToMain();}}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
              <i className="fa fa-briefcase"></i>
            </div>
            <span className="text-xl font-bold">职场进阶</span>
          </a>
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-neutral-700 hover:text-primary" onClick={e => {e.preventDefault(); onBackToMain();}}>首页</a>
            <a href="#courses" className="text-neutral-700 hover:text-primary">热门课程</a>
            <a href="#skills" className="text-neutral-700 hover:text-primary">核心技能</a>
            <a href="#testimonials" className="text-neutral-700 hover:text-primary">学员反馈</a>
            <a href="#instructors" className="text-neutral-700 hover:text-primary">导师团队</a>
          </nav>
          {/* 移动端菜单按钮可省略，后续如需可补充 */}
        </div>
      </header>
      {/* 其余内容照搬HTML结构，注意JSX语法和className */}
      <main className="pt-24">
        {/* 英雄区域 */}
        <section id="home" className="bg-gradient-to-r from-primary to-secondary text-white py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">突破职业瓶颈<br/>开启职场新篇章</h1>
              <p className="text-lg mb-8">我们提供专业的职场技能培训，帮助你在职场中脱颖而出，实现职业目标</p>
              <a href="#courses" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-custom">
                探索课程
              </a>
            </div>
          </div>
        </section>
        {/* 热门课程 */}
        <section id="courses" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">热门职场技能课程</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 课程1 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <div className="relative">
                  <img src="https://picsum.photos/600/400?random=leadership" alt="领导力提升" className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">热门</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher1" alt="刘老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">刘老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">领导力提升与团队管理</h3>
                  <p className="text-neutral-600 text-sm mb-4">掌握高效团队管理技巧，提升领导力</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">¥399</span>
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                  </div>
                </div>
              </div>
              {/* 课程2 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <div className="relative">
                  <img src="https://picsum.photos/600/400?random=communication" alt="沟通技巧" className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">新课</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher2" alt="张老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">张老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">高效沟通与影响力</h3>
                  <p className="text-neutral-600 text-sm mb-4">提升沟通能力，增强职场影响力</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">¥349</span>
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                  </div>
                </div>
              </div>
              {/* 课程3 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <img src="https://picsum.photos/600/400?random=presentation" alt="演讲技巧" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher3" alt="王老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">王老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">商务演讲与表达技巧</h3>
                  <p className="text-neutral-600 text-sm mb-4">提升演讲能力，展现专业形象</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">¥399</span>
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                  </div>
                </div>
              </div>
              {/* 课程4 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <img src="https://picsum.photos/600/400?random=negotiation" alt="谈判技巧" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher4" alt="陈老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">陈老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">商务谈判策略与技巧</h3>
                  <p className="text-neutral-600 text-sm mb-4">掌握谈判技巧，实现双赢局面</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">¥379</span>
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                  </div>
                </div>
              </div>
              {/* 课程5 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <img src="https://picsum.photos/600/400?random=time" alt="时间管理" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher5" alt="赵老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">赵老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">高效时间管理与优先级排序</h3>
                  <p className="text-neutral-600 text-sm mb-4">提升工作效率，平衡工作生活</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">¥329</span>
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-custom">立即报名</a>
                  </div>
                </div>
              </div>
              {/* 课程6 */}
              <div className="card-hover bg-white rounded-xl overflow-hidden shadow-md">
                <img src="https://picsum.photos/600/400?random=interview" alt="面试技巧" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://picsum.photos/100/100?random=teacher6" alt="孙老师" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm text-neutral-600">孙老师</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">求职面试与简历优化</h3>
                  <p className="text-neutral-600 text-sm mb-4">提高面试成功率，获得理想Offer</p>
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
        {/* 核心技能 */}
        <section id="skills" className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">职场核心技能</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-users text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">团队协作</h3>
                <p className="text-neutral-600">学习如何在团队中有效沟通与协作，发挥团队最大效能，实现共同目标。</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-lightbulb-o text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">问题解决</h3>
                <p className="text-neutral-600">掌握系统性的问题分析与解决方法，提升应对工作挑战的能力。</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-line-chart text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">决策能力</h3>
                <p className="text-neutral-600">学习科学决策方法，提高决策效率与准确性，为团队和组织创造价值。</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-tasks text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">项目管理</h3>
                <p className="text-neutral-600">掌握项目管理知识与技能，确保项目按时、按质、按量完成，达成预期目标。</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-comments text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">沟通表达</h3>
                <p className="text-neutral-600">提升沟通表达能力，清晰传递信息，建立良好人际关系，增强职场影响力。</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fa fa-balance-scale text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">压力管理</h3>
                <p className="text-neutral-600">学习压力管理技巧，保持身心健康，提高工作效率和生活质量。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareerAdvancePage; 