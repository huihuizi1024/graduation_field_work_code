import React, { useState, useEffect } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, message, Dropdown, Avatar, Menu, Modal } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined, FireOutlined, ScheduleOutlined, ShoppingOutlined, LogoutOutlined, CalendarOutlined, EnvironmentOutlined, TeamOutlined, LeftOutlined, CheckCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import './MainPage.css';
import { useNavigate, Link } from 'react-router-dom';
import api, { logout } from '../api';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

const identityInfo = {
  '1': { label: '学生', icon: <UserOutlined />, color: '#1890ff' },
  '3': { label: '专家', icon: <ScheduleOutlined />, color: '#52c41a' },
  '4': { label: '管理员', icon: <UserOutlined />, color: '#faad14' },
  '2': { label: '机构', icon: <UserOutlined />, color: '#722ed1' },
};

const MainPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const carouselRef = React.createRef();

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
    // 获取平台活动数据
    fetchPlatformActivities();
  }, []);

  // 获取平台活动数据
  const fetchPlatformActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await api.get('/api/platform-activities', {
        params: {
          status: 1, // 只获取状态为"进行中"的活动
          page: 0,
          size: 10
        }
      });
      
      if (response.code === 200 && response.data?.records) {
        // 将API返回的数据转换为轮播图所需的格式
        const formattedActivities = response.data.records.map(activity => ({
          id: activity.id,
          title: activity.activityName,
          image: activity.imageUrl || 'https://picsum.photos/1200/400?random=' + Math.floor(Math.random() * 10),
          desc: activity.activityDescription,
          startTime: activity.startTime,
          endTime: activity.endTime,
          location: activity.location,
          organizer: activity.organizer
        }));
        setActivities(formattedActivities);
      } else {
        console.error('获取平台活动数据失败:', response.message);
        // 如果API调用失败，使用默认数据
        setActivities(getDefaultActivities());
      }
    } catch (error) {
      console.error('获取平台活动数据出错:', error);
      // 如果发生错误，使用默认数据
      setActivities(getDefaultActivities());
    } finally {
      setLoadingActivities(false);
    }
  };

  // 默认活动数据，当API调用失败时使用
  const getDefaultActivities = () => {
    return [
      {
        id: 1,
        title: '2024春季教育展',
        image: 'https://picsum.photos/1200/400?random=1',
        desc: '探索更多学习机会，开启你的学习之旅',
        startTime: '2024-03-01 09:00:00',
        endTime: '2024-03-15 18:00:00',
        location: '线上',
        organizer: '终身学习平台'
      },
      {
        id: 2,
        title: '终身学习节',
        image: 'https://picsum.photos/1200/400?random=2',
        desc: '永不停止学习的脚步，让知识伴随终身',
        startTime: '2024-04-10 09:00:00',
        endTime: '2024-04-20 18:00:00',
        location: '北京市海淀区',
        organizer: '学习中心'
      },
      {
        id: 3,
        title: '技能提升月',
        image: 'https://picsum.photos/1200/400?random=3',
        desc: '提升职场竞争力，助力职业发展',
        startTime: '2024-05-01 09:00:00',
        endTime: '2024-05-31 18:00:00',
        location: '全国各地',
        organizer: '职业发展协会'
      }
    ];
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

  // 搜索课程功能修改
  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    // 直接导航到项目列表页面
    navigate('/projects');
  };

  // 不同身份功能菜单
  const getMenuItems = () => {
    switch (userRole) {
      case '1': // student
        return [
          { key: 'profile', label: '个人中心', icon: <UserOutlined />, onClick: () => navigate('/profile') },
          { key: 'my-courses', label: '我的课程', icon: <ScheduleOutlined />, onClick: () => navigate('/my-courses') },
          { key: 'certification', label: '证书认证', icon: <IdcardOutlined />, onClick: () => navigate('/skill-certification') },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      case '3': // expert
        return [
          { key: 'profile', label: '专家中心', icon: <UserOutlined />, onClick: () => navigate('/expert/profile') },
          { key: 'cert-review', label: '认证审核', icon: <CheckCircleOutlined />, onClick: () => navigate('/expert/certificate-review') },
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
          { key: 'org-courses', label: '课程管理', icon: <ScheduleOutlined />, onClick: () => navigate('/institution/courses') },
          { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
        ];
      default:
        return [
           { key: 'login', label: '登录', icon: <UserOutlined />, onClick: () => navigate('/login') },
        ];
    }
  };

  // 功能板块数据
  const features = [
    { 
      title: "专业技能", 
      icon: "💼", 
      desc: "专业技能学习", 
      count: "1000+",
      path: '/category/1'
    },
    { 
      title: "学术教育", 
      icon: "🎓", 
      desc: "学术知识与教育", 
      count: "800+",
      path: '/category/2'
    },
    { 
      title: "职业发展", 
      icon: "📈", 
      desc: "职场进阶课程", 
      count: "500+",
      path: '/category/3'
    },
    { 
      title: "创新创业", 
      icon: "💡", 
      desc: "创新思维与创业", 
      count: "300+",
      path: '/category/4'
    },
    { 
      title: "人文艺术", 
      icon: "🎨", 
      desc: "人文艺术与兴趣", 
      count: "1200+",
      path: '/category/5'
    },
    { 
      title: "科学技术", 
      icon: "🔬", 
      desc: "科技前沿探索", 
      count: "600+",
      path: '/category/6'
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
    // 直接使用路由导航，保持URL的一致性
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

  // 获取分类名称
  const getCategoryName = (category) => {
    if (!category) return '未分类';
    
    switch (parseInt(category)) {
      case 1: return '生活技能';
      case 2: return '职场进阶';
      case 3: return '老年教育';
      case 4: return '学历提升';
      case 5: return '兴趣培养';
      case 6: return '技能认证';
      default: return '未分类';
    }
  };

  // 轮播图箭头处理函数
  const handlePrev = () => {
    carouselRef.current.prev();
  };

  const handleNext = () => {
    carouselRef.current.next();
  };

  // 查看活动详情 - 导航到单独页面而不是显示弹窗
  const viewActivityDetail = (activity) => {
    navigate(`/activity/${activity.id}`);
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
        <div className="carousel-container">
          <Button 
            className="carousel-arrow carousel-arrow-left" 
            icon={<LeftOutlined />} 
            onClick={handlePrev}
          />
          <Carousel autoplay dots={true} ref={carouselRef}>
            {activities.map((item, index) => (
              <div key={index}>
                <div
                  className="carousel-item"
                  style={{ backgroundImage: `url(${item.image})` }}
                  onClick={() => viewActivityDetail(item)}
                >
                  <div className="carousel-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          <Button 
            className="carousel-arrow carousel-arrow-right" 
            icon={<RightOutlined />} 
            onClick={handleNext}
          />
        </div>
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