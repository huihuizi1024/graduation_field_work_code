import React, { useState, useEffect } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, message, Dropdown, Avatar, Menu } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined, FireOutlined, ScheduleOutlined, TeamOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import './MainPage.css';
import { useNavigate, Link } from 'react-router-dom';
import api, { logout } from '../api';

const { Title, Paragraph } = Typography;

const identityInfo = {
  '1': { label: '学生', icon: <UserOutlined />, color: '#1890ff' },
  '3': { label: '专家', icon: <TeamOutlined />, color: '#52c41a' },
  '4': { label: '管理员', icon: <UserOutlined />, color: '#faad14' },
  '2': { label: '机构', icon: <UserOutlined />, color: '#722ed1' },
};

const MainPage = ({ 
  onGoToSkillCertification,
  onGoToInterestTraining,
  onGoToLifeSkills,
  onCareerAdvance,
  onGoToSeniorEducation,
  onGoToEducationPromotion
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    size: 3,
    total: 0
  });

  useEffect(() => {
    // ComponentDidMount: Check login status from localStorage
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const storedUserInfo = localStorage.getItem('userInfo');
      const storedRole = localStorage.getItem('role');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
      if (storedRole) {
        setUserRole(storedRole);
      }
    }
    fetchCourses();
  }, []);

  // 获取课程列表
  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Ensure you are using the correct endpoint and parameters
      const res = await api.get('/api/platform-activities', {
        params: { page: 0, size: 3 }
      });
      // The response interceptor already handles response.data, so res is the data object.
      // Adjust this based on your actual API response structure.
      if (res && res.records) { 
        const mapped = res.records.map(item => ({
          id: item.id,
          title: item.activityName || '活动',
          description: item.activityDescription || '',
          category: item.activityType,
          views: item.participantCount || 0
        }));
        setCourses(mapped);
      }
      setLoading(false);
    } catch (error) {
      // The error object from axios interceptor might be nested.
      const errorMsg = error.response?.data?.message || error.message || '获取课程列表失败';
      message.error(errorMsg);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call API to handle server-side logout if needed
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear all user-related data from localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      
      // Update state and navigate
      setIsLoggedIn(false);
      setUserInfo(null);
      setUserRole(null);
      message.success('您已成功退出登录');
      navigate('/login'); // Redirect to login page
    }
  };

  // 搜索课程
  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    // Modify fetchCourses to accept search term if API supports it
    fetchCourses(); 
  };

  // 不同身份功能菜单
  const getMenuItems = () => {
    switch (userRole) {
      case '1': // student
        return [
          { key: 'profile', label: '个人中心', icon: <UserOutlined />, onClick: () => navigate('/profile') },
          { key: 'my-courses', label: '我的课程', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      case '3': // expert
        return [
          { key: 'profile', label: '专家中心', icon: <UserOutlined />, onClick: () => navigate('/expert/profile') },
          { key: 'review', label: '课程评审', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      case '4': // admin
        return [
          { key: 'admin', label: '管理后台', icon: <UserOutlined />, onClick: () => navigate('/admin') },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      case '2': // organization
        return [
          { key: 'profile', label: '机构中心', icon: <UserOutlined />, onClick: () => navigate('/institution/profile') },
          { key: 'org-courses', label: '课程管理', icon: <ScheduleOutlined /> },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      default:
        return [
           { key: 'login', label: '登录', icon: <UserOutlined />, onClick: () => navigate('/login') },
        ];
    }
  };

  // 活动数据
  const activities = [
    {
      id: 1,
      title: '2024春季教育展',
      image: 'https://picsum.photos/1200/400?random=1',
      desc: '探索更多学习机会，开启你的学习之旅'
    },
    {
      id: 2,
      title: '终身学习节',
      image: 'https://picsum.photos/1200/400?random=2',
      desc: '永不停止学习的脚步，让知识伴随终身'
    },
    {
      id: 3,
      title: '技能提升月',
      image: 'https://picsum.photos/1200/400?random=3',
      desc: '提升职场竞争力，助力职业发展'
    },
    {
      id: 4,
      title: '职业认证冲刺营',
      image: 'https://picsum.photos/1200/400?random=4',
      desc: '聚焦热门证书，60天高效备考冲刺'
    },
    {
      id: 5,
      title: '海外院校交流会',
      image: 'https://picsum.photos/1200/400?random=5',
      desc: '直通海外名校，1v1规划留学路径'
    },
    {
      id: 6,
      title: '企业内训开放周',
      image: 'https://picsum.photos/1200/400?random=6',
      desc: '开放名企内训课，偷师核心职场技能'
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
                    icon={identityInfo[userRole]?.icon || <UserOutlined />}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: identityInfo[userRole]?.color || '#ccc' 
                    }}
                  />
                </div>
              </Dropdown>
            ) : (
              <Button onClick={() => navigate('/login')}>登录 / 注册</Button>
            )}
          </div>
        </div>
      </header>

      {/* 轮播图部分 */}
      <div className="carousel-section">
        <Title level={2} className="section-title">热门活动</Title>
        <Carousel autoplay dots={true}>
          {activities.map((item, index) => (
            <div key={index}>
              <div
                className="carousel-item"
                style={{ backgroundImage: `url(${item.image})` }}
                onClick={() => navigate(`/activity/${item.id}`)}
              >
                <div className="carousel-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

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
          <Link to="/about">关于我们</Link>
          <Link to="/contact">联系方式</Link>
          <Link to="/terms">使用条款</Link>
          <Link to="/privacy">隐私政策</Link>
        </Space>
      </footer>
    </div>
  );
};

export default MainPage; 