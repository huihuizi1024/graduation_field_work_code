import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Empty, Tabs, Spin, message, Progress, Tag, Typography } from 'antd';
import { PlayCircleOutlined, HistoryOutlined, CheckCircleOutlined, RightOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const { TabPane } = Tabs;
const { Meta } = Card;
const { Title } = Typography;

const MyCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [courseRecords, setCourseRecords] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });

  // 获取课程记录
  useEffect(() => {
    fetchCourseRecords();
  }, [pagination.current]);

  // 切换标签时获取对应数据
  useEffect(() => {
    if (activeTab === 'completed' && completedCourses.length === 0) {
      fetchCompletedCourses();
    }
  }, [activeTab]);

  const fetchCourseRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses/me/records', {
        params: {
          page: pagination.current - 1,
          size: pagination.pageSize
        }
      });
      
      if (response.code === 200) {
        setCourseRecords(response.data.records || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0
        });
      } else {
        message.error('获取课程记录失败');
      }
    } catch (error) {
      console.error('Error fetching course records:', error);
      message.error('获取课程记录失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedCourses = async () => {
    try {
      setCompletedLoading(true);
      const response = await api.get('/api/courses/me/completed');
      
      if (response.code === 200) {
        setCompletedCourses(response.data || []);
      } else {
        message.error('获取已完成课程失败');
      }
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      message.error('获取已完成课程失败');
    } finally {
      setCompletedLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 获取课程状态标签
  const getCourseStatusTag = (course) => {
    if (course.isWatched) {
      return <Tag color="success" icon={<CheckCircleOutlined />}>已学习</Tag>;
    } else if (course.watchProgress && course.watchProgress > 0) {
      return <Tag color="processing">学习中 ({course.watchProgress}%)</Tag>;
    } else {
      return <Tag color="default">未开始</Tag>;
    }
  };

  // 渲染课程卡片
  const renderCourseCard = (course) => (
    <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
            <img 
              alt={course.courseName}
              src={course.coverImageUrl || 'https://via.placeholder.com/300x160?text=No+Image'}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div 
              style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '30px 10px 10px 10px'
              }}
            >
              <div style={{ color: '#fff', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{course.categoryName}</span>
                <span>{course.duration}分钟</span>
              </div>
            </div>
            {course.isWatched && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px',
                  background: 'rgba(82, 196, 26, 0.8)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <CheckCircleOutlined style={{ color: '#fff', fontSize: '16px' }} />
              </div>
            )}
          </div>
        }
        actions={[
          <Button 
            type="link" 
            icon={course.isWatched ? <HistoryOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleCourseClick(course.id)}
          >
            {course.isWatched ? '重新学习' : '开始学习'}
          </Button>
        ]}
      >
        <Meta
          title={
            <div style={{ height: '44px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {course.courseName}
            </div>
          }
          description={
            <div>
              <div style={{ marginBottom: '8px' }}>
                {getCourseStatusTag(course)}
              </div>
              {course.watchProgress !== undefined && (
                <Progress 
                  percent={course.watchProgress} 
                  size="small" 
                  status={course.isWatched ? "success" : "active"}
                  strokeColor={course.isWatched ? "#52c41a" : "#1890ff"}
                />
              )}
            </div>
          }
        />
      </Card>
    </Col>
  );

  return (
    <div className="my-courses">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4}>我的课程</Title>
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane 
          tab={<span><HistoryOutlined /> 全部课程</span>} 
          key="all"
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : courseRecords.length > 0 ? (
            <Row gutter={[16, 16]}>
              {courseRecords.map(course => renderCourseCard(course))}
            </Row>
          ) : (
            <Empty 
              description="暂无课程记录" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                icon={<RightOutlined />} 
                onClick={() => navigate('/')}
              >
                去探索课程
              </Button>
            </Empty>
          )}
        </TabPane>
        
        <TabPane 
          tab={<span><CheckCircleOutlined /> 已完成课程</span>} 
          key="completed"
        >
          {completedLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : completedCourses.length > 0 ? (
            <Row gutter={[16, 16]}>
              {completedCourses.map(course => renderCourseCard(course))}
            </Row>
          ) : (
            <Empty 
              description="暂无已完成课程" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                icon={<RightOutlined />} 
                onClick={() => navigate('/')}
              >
                去探索课程
              </Button>
            </Empty>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MyCourses; 