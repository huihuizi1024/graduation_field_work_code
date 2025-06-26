import React, { useState } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, Dropdown, Avatar, Menu } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined, FireOutlined, ScheduleOutlined, TeamOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import './MainPage.css';

const { Title, Paragraph } = Typography;

const identityInfo = {
  student: { label: '学生', icon: <UserOutlined />, color: '#1890ff' },
  expert: { label: '专家', icon: <TeamOutlined />, color: '#52c41a' },
  admin: { label: '管理员', icon: <UserOutlined />, color: '#faad14' },
  organization: { label: '机构', icon: <UserOutlined />, color: '#722ed1' },
};

const MainPage = ({ onLoginClick, onLogout, isLoggedIn, userRole, onGoToSkillCertification, onGoToInterestTraining, onGoToLifeSkills, onCareerAdvance, onGoToSeniorEducation, onGoToEducationPromotion }) => {
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
    { title: "生活技能", icon: "🏠", desc: "生活技能提升", count: "1000+" },
    { title: "职场进阶", icon: "💼", desc: "职业发展课程", count: "800+" },
    { title: "老年教育", icon: "👴", desc: "银龄学习课程", count: "500+" },
    { title: "学历提升", icon: "🎓", desc: "学历教育项目", count: "300+" },
    { title: "兴趣培养", icon: "🎨", desc: "兴趣拓展课程", count: "1200+" },
    { title: "技能认证", icon: "⚒️", desc: "职业技能认证", count: "600+" }
  ];

  // 学习动态数据
  const learningUpdates = [
    "张先生 刚刚完成了《Excel数据分析》课程",
    "李女士 获得了《摄影技巧》课程证书",
    "王同学 报名参加了《人工智能基础》课程",
    "刘女士 完成了本周学习任务"
  ];

  // 不同身份功能菜单
  const getMenuItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { key: 'profile', label: '个人中心', icon: <UserOutlined /> },
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
          { key: 'profile', label: '管理后台', icon: <UserOutlined /> },
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

  return (
    <div className="main-page">
      {/* 顶部导航栏 */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">终身学习平台</div>
          <div className="search-section">
            <Input
              size="large"
              placeholder="搜索课程、活动..."
              prefix={<SearchOutlined />}
              className="search-input"
            />
            <Button type="primary" size="large">
              搜索
            </Button>
          </div>
          <div className="login-section">
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />} 
              className="shop-btn"
            >
              积分商城
            </Button>
            {isLoggedIn ? (
              <Dropdown 
                menu={{ items: getMenuItems() }} 
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar 
                  style={{ backgroundColor: identityInfo[userRole]?.color || '#1890ff', cursor: 'pointer' }} 
                  size={40} 
                  icon={identityInfo[userRole]?.icon || <UserOutlined />} 
                />
              </Dropdown>
            ) : (
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={onLoginClick}
              >
                登录/注册
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 轮播图部分 */}
      <section className="carousel-section">
        <Carousel autoplay draggable effect="fade">
          {carouselData.map((item, index) => (
            <div key={index}>
              <div className="carousel-item" style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${item.image})` 
              }}>
                <div className="carousel-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Button type="primary" size="large" className="carousel-btn">
                    立即报名 <RightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* 实时学习动态 */}
      <section className="updates-section">
        <div className="updates-content">
          <FireOutlined className="updates-icon" />
          <div className="updates-scroll">
            {learningUpdates.map((update, index) => (
              <div key={index} className="update-item">{update}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能板块 */}
      <section className="features-section">
        <Title level={3} className="section-title">学习领域</Title>
        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col xs={12} sm={8} md={6} lg={4} key={index}>
              <Card 
                hoverable 
                className="feature-card"
                onClick={feature.title === "技能认证" ? onGoToSkillCertification : feature.title === "兴趣培养" ? onGoToInterestTraining : feature.title === "生活技能" ? onGoToLifeSkills : feature.title === "职场进阶" ? onCareerAdvance : feature.title === "老年教育" ? onGoToSeniorEducation : feature.title === "学历提升" ? onGoToEducationPromotion : undefined}
                style={feature.title === "技能认证" ? { cursor: 'pointer' } : feature.title === "职场进阶" ? { cursor: 'pointer' } : feature.title === "老年教育" ? { cursor: 'pointer' } : feature.title === "学历提升" ? { cursor: 'pointer' } : {}}
              >
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <p>{feature.desc}</p>
                <div className="feature-count">{feature.count}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 热门课程 */}
      <section className="hot-courses-section">
        <Title level={3} className="section-title">热门课程</Title>
        <Row gutter={[24, 24]}>
          {/* 这里可根据实际数据渲染课程卡片，示例为静态 */}
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="course-card">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={4}>示例课程A</Title>
                <Space wrap>
                  <Tag color="#f50">标签1</Tag>
                  <Tag color="#2db7f5">标签2</Tag>
                </Space>
                <div className="course-info">
                  <Space>
                    <TeamOutlined />
                    <span>张老师</span>
                  </Space>
                  <Space>
                    <ScheduleOutlined />
                    <span>2024-06-01</span>
                  </Space>
                </div>
                <div className="course-footer">
                  <span className="course-category">IT</span>
                  <span className="course-views">1000 浏览</span>
                </div>
                <Button type="primary" block>
                  立即报名
                </Button>
              </Space>
            </Card>
          </Col>
          {/* 可继续添加更多课程卡片 */}
        </Row>
      </section>

      {/* 底部信息 */}
      <footer className="main-footer">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={8}>
            <Title level={4}>关于我们</Title>
            <Paragraph>
              终身学习平台致力于为每个人提供优质的学习资源，
              让学习成为一种生活方式。
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>联系方式</Title>
            <Paragraph>
              邮箱：1981770964@qq.com<br />
              电话：17265635401
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>关注我们</Title>
            <Space size="large">
              <span>微信</span>
              <span>微博</span>
              <span>抖音</span>
            </Space>
          </Col>
        </Row>
        <Divider />
        <Row justify="center">
          <Col>
            <p>© 2024 终身学习平台 版权所有</p>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default MainPage; 