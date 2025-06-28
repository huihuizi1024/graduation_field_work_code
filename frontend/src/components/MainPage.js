import React, { useState, useEffect } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, message, Dropdown, Avatar, Menu } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined, FireOutlined, ScheduleOutlined, TeamOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const identityInfo = {
  student: { label: '学生', icon: <UserOutlined />, color: '#1890ff' },
  expert: { label: '专家', icon: <TeamOutlined />, color: '#52c41a' },
  admin: { label: '管理员', icon: <UserOutlined />, color: '#faad14' },
  organization: { label: '机构', icon: <UserOutlined />, color: '#722ed1' },
};

const MainPage = ({ 
  onLoginClick, 
  onLogout, 
  isLoggedIn, 
  userRole,
  onGoToSkillCertification,
  onGoToInterestTraining,
  onGoToLifeSkills,
  onCareerAdvance,
  onGoToSeniorEducation,
  onGoToEducationPromotion
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    size: 3,
    total: 0
  });

  // 获取课程列表
  const fetchCourses = async () => {
    try {
      setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses([
        {
          id: 1,
          title: "Python编程基础",
          description: "零基础入门Python编程",
          category: "编程技术",
          views: 1200
        },
        {
          id: 2,
          title: "数据分析实战",
          description: "使用Excel和Python进行数据分析",
          category: "数据分析",
          views: 800
        },
        {
          id: 3,
          title: "职场沟通技巧",
          description: "提升职场沟通能力",
          category: "职场技能",
          views: 1500
        }
      ]);
      setLoading(false);
    } catch (error) {
      message.error('获取课程列表失败');
      setLoading(false);
    }
  };

  // 搜索课程
  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    fetchCourses();
  };

  // 不同身份功能菜单
  const getMenuItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { key: 'profile', label: '个人中心', icon: <UserOutlined />, onClick: () => navigate('/profile') },
          { key: 'my-courses', label: '我的课程', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: onLogout },
        ];
      case 'expert':
        return [
          { key: 'profile', label: '专家中心', icon: <UserOutlined /> },
          { key: 'review', label: '课程评审', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: onLogout },
        ];
      case 'admin':
        return [
          { key: 'admin', label: '管理后台', icon: <UserOutlined />, onClick: () => navigate('/admin') },
          { key: 'user-manage', label: '用户管理', icon: <TeamOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: onLogout },
        ];
      case 'organization':
        return [
          { key: 'profile', label: '机构中心', icon: <UserOutlined /> },
          { key: 'org-courses', label: '课程管理', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: onLogout },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchCourses();
    // 从localStorage获取用户信息
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // 轮播图数据
  const carouselData = [
    {
      title: "2024春季教育展",
      image: "https://img.freepik.com/free-photo/front-view-stacked-books-graduation-cap-diploma-education-day_23-2149241011.jpg",
      description: "探索更多学习机会，开启你的学习之旅"
    },
    {
      title: "职业技能提升计划",
      image: "https://img.freepik.com/free-photo/woman-working-laptop_23-2148505297.jpg",
      description: "提升职场竞争力，助力职业发展"
    },
    {
      title: "终身学习月活动",
      image: "https://img.freepik.com/free-photo/elderly-people-learning-use-laptop_23-2148962895.jpg",
      description: "永不停止学习的脚步，让知识伴随终身"
    }
  ];

  // 功能板块数据
  const features = [
    { 
      title: "生活技能", 
      icon: "🏠", 
      desc: "生活技能提升", 
      count: "1000+",
      onClick: onGoToLifeSkills,
      path: '/life-skills'
    },
    { 
      title: "职场进阶", 
      icon: "💼", 
      desc: "职业发展课程", 
      count: "800+",
      onClick: onCareerAdvance,
      path: '/career-advance'
    },
    { 
      title: "老年教育", 
      icon: "👴", 
      desc: "银龄学习课程", 
      count: "500+",
      onClick: onGoToSeniorEducation,
      path: '/senior-education'
    },
    { 
      title: "学历提升", 
      icon: "🎓", 
      desc: "学历教育项目", 
      count: "300+",
      onClick: onGoToEducationPromotion,
      path: '/education-promotion'
    },
    { 
      title: "兴趣培养", 
      icon: "🎨", 
      desc: "兴趣拓展课程", 
      count: "1200+",
      onClick: onGoToInterestTraining,
      path: '/interest-training'
    },
    { 
      title: "技能认证", 
      icon: "⚒️", 
      desc: "职业技能认证", 
      count: "600+",
      onClick: onGoToSkillCertification,
      path: '/skill-certification'
    }
  ];

  // 学习动态数据
  const learningUpdates = [
    "张先生 刚刚完成了《Excel数据分析》课程",
    "李女士 获得了《摄影技巧》课程证书",
    "王同学 报名参加了《人工智能基础》课程",
    "刘女士 完成了本周学习任务"
  ];

  // 处理功能板块点击
  const handleFeatureClick = (feature) => {
    // 优先使用回调函数，这样可以保持状态管理的一致性
    if (feature.onClick) {
      feature.onClick();
    }
    // 即使有回调函数，也执行路由导航，这样可以保持URL的一致性
    navigate(feature.path);
  };

  // 处理积分商城点击
  const handlePointsMallClick = () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    navigate('/points-mall');
  };

  return (
    <div className="main-page">
      {/* 顶部导航栏 */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>终身学习平台</div>
          <div className="search-section">
            <Input
              className="search-input"
              placeholder="搜索课程、认证等"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </div>
          <div className="login-section">
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />} 
              className="shop-btn"
              onClick={handlePointsMallClick}
            >
              积分商城
            </Button>
            {isLoggedIn ? (
              <Dropdown menu={{ items: getMenuItems() }} placement="bottomRight">
                <div className="user-avatar">
                  <Avatar 
                    size={40} 
                    src={userInfo?.avatar}
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </Dropdown>
            ) : (
              <Button type="primary" onClick={onLoginClick}>
                登录
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 轮播图部分 */}
      <Carousel autoplay className="carousel-section">
        {carouselData.map((item, index) => (
          <div key={index}>
            <div
              className="carousel-item"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="carousel-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Button type="primary" size="large" className="carousel-btn">
                  了解更多
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* 实时学习动态 */}
      <div className="updates-section">
        <div className="updates-content">
          <FireOutlined className="updates-icon" />
          <div className="updates-scroll">
            {learningUpdates.map((update, index) => (
              <div key={index} className="update-item">
                {update}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 功能板块 */}
      <div className="features-section">
        <Title level={2} className="section-title">
          学习领域
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
              <Card 
                className="feature-card"
                hoverable
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.desc}</Paragraph>
                <div className="feature-count">{feature.count}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 热门课程 */}
      <div className="hot-courses-section">
        <Title level={2} className="section-title">
          热门课程
        </Title>
        <Row gutter={[24, 24]}>
          {courses.map(course => (
            <Col xs={24} sm={12} md={8} key={course.id}>
              <Card
                className="course-card"
                hoverable
                cover={
                  <img
                    alt={course.title}
                    src={`https://source.unsplash.com/400x300/?education,${course.category}`}
                  />
                }
              >
                <Card.Meta
                  title={course.title}
                  description={course.description}
                />
                <div className="course-footer">
                  <Tag color="blue" className="course-category">
                    {course.category}
                  </Tag>
                  <span className="course-views">
                    <TeamOutlined /> {course.views}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 底部信息 */}
      <footer className="main-footer">
        <Space split={<Divider type="vertical" />}>
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
        </Space>
      </footer>
    </div>
  );
};

export default MainPage; 