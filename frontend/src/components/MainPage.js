import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, message, Dropdown, Avatar, Menu, Modal, Spin } from 'antd';
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

const MainPage = ({ 
  onGoToSkillCertification, 
  onGoToInterestTraining, 
  onGoToLifeSkills, 
  onCareerAdvance, 
  onGoToEducationPromotion 
}) => {
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
  
  // 拖动相关状态
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselContainerRef = useRef(null);

  useEffect(() => {
    // ComponentDidMount: Check login status from localStorage
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const storedUserInfo = localStorage.getItem('userInfo');
      const storedRole = localStorage.getItem('role');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        // 确保头像字段正确映射
        if (parsedUserInfo.avatarUrl && !parsedUserInfo.avatar) {
          parsedUserInfo.avatar = parsedUserInfo.avatarUrl;
        }
        setUserInfo(parsedUserInfo);
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

      if (response.code === 200 && response.data?.records && response.data.records.length > 0) {
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
        console.log('API未返回活动数据，使用默认轮播图数据');
        // 设置默认的轮播图数据
        setActivities([
          {
            id: 1,
            title: "2024年终身学习节",
            image: "https://picsum.photos/1200/400?random=1",
            desc: "终身学习，成就未来。全平台课程限时优惠，快来参与学习吧！"
          },
          {
            id: 2,
            title: "技能认证专场",
            image: "https://picsum.photos/1200/400?random=2", 
            desc: "专业技能认证，提升职场竞争力。多种认证项目等你来挑战！"
          },
          {
            id: 3,
            title: "在线学习新体验",
            image: "https://picsum.photos/1200/400?random=3",
            desc: "全新的在线学习平台，随时随地享受优质教育资源。"
          }
        ]);
      }
    } catch (error) {
      console.error('获取平台活动数据出错:', error);
      console.log('使用默认轮播图数据');
      // 网络错误时也使用默认数据
      setActivities([
        {
          id: 1,
          title: "2024年终身学习节",
          image: "https://picsum.photos/1200/400?random=1",
          desc: "终身学习，成就未来。全平台课程限时优惠，快来参与学习吧！"
        },
        {
          id: 2,
          title: "技能认证专场",
          image: "https://picsum.photos/1200/400?random=2", 
          desc: "专业技能认证，提升职场竞争力。多种认证项目等你来挑战！"
        },
        {
          id: 3,
          title: "在线学习新体验",
          image: "https://picsum.photos/1200/400?random=3",
          desc: "全新的在线学习平台，随时随地享受优质教育资源。"
        }
      ]);
    } finally {
      setLoadingActivities(false);
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

  // 触摸事件处理
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 100) {
      // 向左滑动
      carouselRef.current.next();
    }
    
    if (touchEndX - touchStartX > 100) {
      // 向右滑动
      carouselRef.current.prev();
    }
  };

  // 鼠标事件处理
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setTouchStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (touchStartX - touchEndX > 100) {
      // 向左滑动
      carouselRef.current.next();
    }
    
    if (touchEndX - touchStartX > 100) {
      // 向右滑动
      carouselRef.current.prev();
    }
    
    setIsDragging(false);
  };

  // 处理鼠标离开容器
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="main-page">
      {/* 顶部导航栏，固定在顶部，并有背景色 */}
      <div style={{ padding: '10px 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 左侧：终身学习平台 */}
        <Link to="/">
          <Title level={3} style={{ margin: 0, color: '#1890ff', whiteSpace: 'nowrap' }}>终身学习平台</Title>
        </Link>

        {/* 中间：搜索框 */}
        <div style={{ flexGrow: 1, maxWidth: 600, margin: '0 20px' }}>
          <Input.Search
            placeholder="搜索课程、认证等"
            allowClear
            enterButton="搜索"
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        {/* 右侧：积分商城和用户菜单 */}
        <Space size="middle">
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            size="large"
            style={{ background: '#f5222d', borderColor: '#f5222d' }}
            onClick={handlePointsMallClick}
          >
            积分商城
          </Button>
          <Dropdown overlay={<Menu items={getMenuItems()} />} placement="bottomRight" arrow>
            <Avatar 
              size="large" 
              src={isLoggedIn && userInfo?.avatar ? userInfo.avatar : null}
              icon={!isLoggedIn || !userInfo?.avatar ? <UserOutlined /> : null}
              style={{ 
                cursor: 'pointer',
                backgroundColor: !isLoggedIn || !userInfo?.avatar ? (identityInfo[userRole]?.color || '#cccccc') : 'transparent'
              }}
            />
          </Dropdown>
        </Space>
      </div>

      {/* 页面主体内容，留出顶部栏高度 */}
      <div style={{ paddingTop: 70 }}> {/* 根据顶部栏高度调整此值 */}
        {/* 轮播图 */}
        <Spin spinning={loadingActivities} tip="活动加载中...">
          <div 
            className="carousel-container" 
            ref={carouselContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <button className="carousel-arrow carousel-arrow-left" onClick={handlePrev}>
              <LeftOutlined />
            </button>
            <Carousel 
              autoplay 
              effect="fade" 
              ref={carouselRef} 
              dots={true} 
              style={{ width: '100%', height: 400, overflow: 'hidden' }}
              draggable={true}
              swipeToSlide={true}
              touchMove={true}
              swipe={true}
            >
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
            <button className="carousel-arrow carousel-arrow-right" onClick={handleNext}>
              <RightOutlined />
            </button>
          </div>
        </Spin>

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
    </div>
  );
};

export default MainPage; 