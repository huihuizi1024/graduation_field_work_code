import React, { useState, useEffect } from 'react';
import { Input, Button, Carousel, Card, Row, Col, Typography, Space, Divider, Tag, message } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined, FireOutlined, ScheduleOutlined, TeamOutlined, ShoppingOutlined } from '@ant-design/icons';
import './MainPage.css';

const { Title, Paragraph } = Typography;

// API基础URL，与API文档保持一致
const API_BASE_URL = 'http://localhost:8080';

// 统一的API调用函数
const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const result = await response.json();
    
    // 检查API统一响应格式
    if (!result.hasOwnProperty('success')) {
      throw new Error('Invalid API response format');
    }

    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const MainPage = () => {
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
      const result = await fetchApi(`/api/courses?page=${pagination.page}&size=${pagination.size}`);
      
      if (result.success) {
        setCourses(result.data.data || []);
        setPagination({
          page: result.data.page,
          size: result.data.size,
          total: result.data.total
        });
      } else {
        message.error(result.message || '获取课程列表失败');
      }
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索课程
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    try {
      setLoading(true);
      const result = await fetchApi(`/api/courses/search?keyword=${encodeURIComponent(searchValue)}&page=1&size=${pagination.size}`);
      
      if (result.success) {
        setCourses(result.data.data || []);
        setPagination({
          page: result.data.page,
          size: result.data.size,
          total: result.data.total
        });
      } else {
        message.error(result.message || '搜索失败');
      }
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 跳转到积分商城
  const handleShopClick = () => {
    window.location.href = '/points-mall';
  };

  // 跳转到登录页
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  // 报名课程
  const handleEnrollCourse = async (courseId) => {
    try {
      const result = await fetchApi(`/api/courses/${courseId}/enroll`, {
        method: 'POST'
      });
      
      if (result.success) {
        message.success(result.message || '报名成功');
      } else {
        message.error(result.message || '报名失败');
      }
    } catch (error) {
      message.error('报名失败');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [pagination.page, pagination.size]);

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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" size="large" onClick={handleSearch} loading={loading}>
              搜索
            </Button>
          </div>
          <div className="login-section">
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />} 
              className="shop-btn"
              onClick={handleShopClick}
            >
              积分商城
            </Button>
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              onClick={handleLoginClick}
            >
              登录/注册
            </Button>
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
              <Card hoverable className="feature-card">
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
          {loading ? (
            <Col span={24} style={{ textAlign: 'center' }}>加载中...</Col>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Col xs={24} sm={12} md={8} key={course.id}>
                <Card hoverable className="course-card">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Title level={4}>{course.title}</Title>
                    <Space wrap>
                      {course.tags?.map((tag, i) => (
                        <Tag color={i === 0 ? "#f50" : "#2db7f5"} key={i}>{tag}</Tag>
                      ))}
                    </Space>
                    <div className="course-info">
                      <Space>
                        <TeamOutlined />
                        <span>{course.teacher}</span>
                      </Space>
                      <Space>
                        <ScheduleOutlined />
                        <span>{course.startTime}</span>
                      </Space>
                    </div>
                    <div className="course-footer">
                      <span className="course-category">{course.category}</span>
                      <span className="course-views">{course.views} 浏览</span>
                    </div>
                    <Button 
                      type="primary" 
                      block 
                      onClick={() => handleEnrollCourse(course.id)}
                    >
                      立即报名
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center' }}>暂无课程数据</Col>
          )}
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