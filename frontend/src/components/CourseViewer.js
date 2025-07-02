import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Progress, Tag, Spin, message, Typography, Divider, Modal, Alert, Space } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined, GiftOutlined, HomeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const { Title, Text, Paragraph } = Typography;

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [lastReportedProgress, setLastReportedProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // 获取课程详情
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/courses/${id}`);
        
        if (response.code === 200 && response.data) {
          setCourse(response.data);
          
          if (response.data.isWatched) {
            setCurrentProgress(100);
            setLastReportedProgress(100);
          } else if (response.data.watchProgress) {
            setCurrentProgress(response.data.watchProgress);
            setLastReportedProgress(response.data.watchProgress);
          }
          
          setEarnedPoints(response.data.pointsReward || 0);
        } else {
          message.error('获取课程失败');
          navigate(-1);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        message.error('获取课程失败');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, navigate]);

  // 处理视频播放进度
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const progress = Math.floor((video.currentTime / video.duration) * 100);
    setCurrentProgress(progress);
    
    // 每10%进度报告一次后端
    if (progress - lastReportedProgress >= 10) {
      reportProgress(progress);
    }
    
    // 如果视频播放完毕，标记为已完成
    if (progress >= 90 && !course.isWatched) {
      completeCourse();
    }
  };
  
  // 向后端报告观看进度
  const reportProgress = async (progress) => {
    try {
      await api.post(`/api/courses/${id}/progress`, null, {
        params: { progress }
      });
      setLastReportedProgress(progress);
    } catch (error) {
      console.error('Failed to report progress:', error);
    }
  };
  
  // 完成课程
  const completeCourse = async () => {
    try {
      const response = await api.post(`/api/courses/${id}/complete`);
      if (response.code === 200) {
        // 标记为已完成
        setCourse(prev => ({ ...prev, isWatched: true }));
        // 显示积分奖励弹窗
        if (!course.isWatched) {
          setShowRewardModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to complete course:', error);
    }
  };
  
  // 渲染课程状态标签
  const renderStatusTag = (course) => {
    if (course.isWatched) {
      return <Tag color="success" icon={<CheckCircleOutlined />}>已学习</Tag>;
    } else if (course.watchProgress && course.watchProgress > 0) {
      return <Tag color="processing">学习中 ({course.watchProgress}%)</Tag>;
    } else {
      return <Tag color="default">未开始</Tag>;
    }
  };
  
  // 处理返回按钮
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理获得积分弹窗关闭
  const handleRewardModalClose = () => {
    setShowRewardModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
        >
          返回课程列表
        </Button>
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>加载课程中...</div>
        </div>
      ) : course ? (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Card 
                bordered={false} 
                className="video-card"
                style={{ backgroundColor: '#f0f2f5' }}
              >
                {course.videoUrl ? (
                  <video
                    ref={videoRef}
                    controls
                    width="100%"
                    poster={course.coverImageUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{ borderRadius: '8px' }}
                  >
                    <source src={course.videoUrl} type="video/mp4" />
                    您的浏览器不支持视频播放
                  </video>
                ) : (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <PlayCircleOutlined style={{ fontSize: '48px', opacity: 0.5 }} />
                    <div style={{ marginTop: '20px', opacity: 0.5 }}>暂无视频</div>
                  </div>
                )}
                <div style={{ marginTop: '15px' }}>
                  <Progress 
                    percent={currentProgress} 
                    status={currentProgress === 100 ? "success" : "active"}
                    strokeColor={currentProgress === 100 ? "#52c41a" : "#1890ff"}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title="课程信息" bordered={false}>
                <Title level={4}>{course.courseName}</Title>
                <div style={{ marginBottom: '15px' }}>
                  {renderStatusTag(course)}
                  <Tag color="blue">{course.categoryName}</Tag>
                  <Tag icon={<GiftOutlined />} color="purple">完成可得 {course.pointsReward} 积分</Tag>
                </div>
                
                <Divider orientation="left">课程详情</Divider>
                <p><Text strong>讲师：</Text>{course.instructor}</p>
                <p><Text strong>时长：</Text>{course.duration}分钟</p>
                <p><Text strong>浏览量：</Text>{course.viewCount || 0}</p>
                <p><Text strong>上线日期：</Text>{new Date(course.startDate).toLocaleDateString()}</p>
                
                <Divider orientation="left">课程介绍</Divider>
                <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: '更多' }}>
                  {course.description || '暂无课程介绍'}
                </Paragraph>
              </Card>
            </Col>
          </Row>
          
          <Modal
            title="恭喜获得积分奖励！"
            open={showRewardModal}
            onOk={handleRewardModalClose}
            onCancel={handleRewardModalClose}
            footer={[
              <Button key="ok" type="primary" onClick={handleRewardModalClose}>
                太棒了！
              </Button>
            ]}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <GiftOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
              <Title level={4} style={{ marginTop: '20px' }}>
                您已完成课程学习
              </Title>
              <Alert
                message={`获得 ${earnedPoints} 积分奖励！`}
                type="success"
                style={{ marginTop: '15px' }}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Title level={4}>课程不存在或已被删除</Title>
          <Button type="primary" onClick={handleGoBack} style={{ marginTop: '20px' }}>
            返回课程列表
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseViewer; 