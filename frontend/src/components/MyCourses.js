import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Empty, Spin, Tag, Typography, Layout } from 'antd';
import { PlayCircleOutlined, HistoryOutlined, CheckCircleOutlined, HomeOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { message } from 'antd';
import './MyCourses.css';

const { Meta } = Card;
const { Title } = Typography;
const { Content } = Layout;

const MyCourses = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);

  // 获取已完成课程
  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      setLoading(true);
      
      // 确保有token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('未找到认证令牌，用户可能未登录');
        message.error('请先登录');
        navigate('/login');
        return;
      }
      
      const response = await api.get('/api/courses/me/completed', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.code === 200) {
        setCompletedCourses(response.data || []);
      } else {
        message.error('获取已完成课程失败');
        console.error('获取已完成课程失败:', response);
      }
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      if (error.response && error.response.status === 401) {
        message.error('请先登录');
        navigate('/login');
      } else {
        message.error('获取已完成课程失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/projects/${courseId}`);
  };

  // 获取分类颜色
  const getCategoryColor = (category) => {
    if (!category) return 'default';
    
    switch (category.toLowerCase()) {
      case '专业技能': return 'blue';
      case '学术教育': return 'purple';
      case '职业发展': return 'green';
      case '创新创业': return 'orange';
      case '人文艺术': return 'magenta';
      case '科学技术': return 'cyan';
      default: return 'default';
    }
  };

  // 渲染课程卡片
  const renderCourseCard = (course) => (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={course.id} className="course-card-container">
      <Card
        hoverable
        className="course-card"
        cover={
          <div className="course-card-cover" onClick={() => handleCourseClick(course.id)}>
            <img 
              alt={course.courseName}
              src={course.coverImageUrl || 'https://via.placeholder.com/300x160?text=No+Image'}
            />
            <div className="course-card-overlay">
              <div className="course-duration">
                <ClockCircleOutlined /> {course.duration || 0}分钟
              </div>
            </div>
            <div className="course-category-tag">
              <Tag color={getCategoryColor(course.categoryName)}>{course.categoryName || '未分类'}</Tag>
            </div>
            <div className="course-complete-badge">
              <CheckCircleOutlined />
            </div>
          </div>
        }
      >
        <Meta
          title={
            <div className="course-title" onClick={() => handleCourseClick(course.id)}>
              {course.courseName}
            </div>
          }
          description={
            <div className="course-details">
              <div className="course-info">
                <div className="course-instructor">
                  <UserOutlined /> {course.instructor || '未知讲师'}
                </div>
              </div>
              <div className="course-actions">
                <Button 
                  type="primary" 
                  icon={<HistoryOutlined />}
                  onClick={() => handleCourseClick(course.id)}
                  className="review-button"
                  size="small"
                >
                  重新学习
                </Button>
              </div>
            </div>
          }
        />
      </Card>
    </Col>
  );

  return (
    <Layout className="my-courses-layout">
      <Content className="my-courses-content">
        <div className="page-header">
          <div className="header-row">
            <Title level={4} className="page-title">已完成课程</Title>
            {!isEmbedded && (
              <Button 
                type="primary" 
                icon={<HomeOutlined />} 
                onClick={() => navigate('/')}
                className="header-button"
              >
                返回首页
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="spinner-container">
            <Spin size="large" tip="加载中..." />
          </div>
        ) : completedCourses.length > 0 ? (
          <div className="courses-wrapper">
            <Row gutter={[16, 16]} className="course-grid">
              {completedCourses.map(course => renderCourseCard(course))}
            </Row>
          </div>
        ) : (
          <div className="empty-container">
            <Empty 
              description="暂无已完成课程" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                onClick={() => navigate('/')}
              >
                去探索课程
              </Button>
            </Empty>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default MyCourses;