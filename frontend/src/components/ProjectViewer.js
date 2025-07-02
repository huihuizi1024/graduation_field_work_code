import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Progress, Row, Col, Typography, notification, Spin, Tag } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getToken } from '../api/index';
import './ProjectViewer.css';

const { Title, Text, Paragraph } = Typography;

const ProjectViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isWatched, setIsWatched] = useState(false);
  
  useEffect(() => {
    fetchProjectDetails();
    
    // 清理函数：当组件卸载时停止进度记录
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [id]);
  
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.data.code === 200) {
        setProject(response.data.data);
        
        // 设置初始进度
        if (response.data.data.watchProgress) {
          setWatchProgress(response.data.data.watchProgress);
        }
        
        // 设置是否已观看
        if (response.data.data.isWatched) {
          setIsWatched(true);
        }
      } else {
        notification.error({
          message: '获取项目失败',
          description: response.data.message
        });
      }
    } catch (error) {
      notification.error({
        message: '获取项目失败',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 开始记录观看进度
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // 每15秒记录一次观看进度
    progressIntervalRef.current = setInterval(() => {
      if (videoRef.current) {
        const video = videoRef.current;
        
        // 只有在视频播放时才记录进度
        if (!video.paused && !video.ended && video.readyState > 2) {
          const duration = video.duration;
          const currentTime = video.currentTime;
          
          // 计算观看进度百分比
          const progress = Math.round((currentTime / duration) * 100);
          
          // 更新本地状态
          setWatchProgress(progress);
          
          // 发送进度到服务器
          recordProgress(progress);
          
          // 如果达到90%以上，标记为已完成
          if (progress >= 90 && !isWatched) {
            completeProject();
          }
        }
      }
    }, 15000); // 15秒记录一次
  };
  
  // 记录观看进度
  const recordProgress = async (progress) => {
    try {
      await axios.post(`/api/projects/${id}/record-watching?progress=${progress}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
    } catch (error) {
      console.error('记录观看进度失败:', error);
    }
  };
  
  // 标记项目为已完成
  const completeProject = async () => {
    try {
      const response = await axios.post(`/api/projects/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.data.code === 200) {
        setIsWatched(true);
        notification.success({
          message: '恭喜！',
          description: '您已完成项目观看，获得积分奖励！',
          placement: 'topRight'
        });
      }
    } catch (error) {
      console.error('标记项目完成失败:', error);
    }
  };
  
  // 视频事件处理
  const handleVideoPlay = () => {
    startProgressTracking();
  };
  
  const handleVideoEnded = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setWatchProgress(100);
    if (!isWatched) {
      completeProject();
    }
  };
  
  const handleVideoTimeUpdate = (e) => {
    if (videoRef.current) {
      const video = videoRef.current;
      const duration = video.duration;
      const currentTime = video.currentTime;
      
      // 计算观看进度百分比
      const progress = Math.round((currentTime / duration) * 100);
      
      // 仅在本地更新进度条，不调用API
      setWatchProgress(progress);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="加载项目中..." />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div style={{ textAlign: 'center', margin: '50px' }}>
        <Title level={3}>项目不存在或已被删除</Title>
        <Button type="primary" onClick={() => navigate('/projects')}>返回项目列表</Button>
      </div>
    );
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      1: 'green',
      2: 'blue',
      3: 'purple',
      4: 'orange',
      5: 'cyan',
      6: 'magenta'
    };
    return colors[category] || 'default';
  };
  
  return (
    <div className="project-viewer-container">
      <div className="navigation-buttons" style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
        <Button onClick={() => navigate('/projects')}>返回项目列表</Button>
      </div>
      
      <Card
        title={
          <div className="project-viewer-header">
            <Title level={3}>{project.projectName}</Title>
            <Tag color={getCategoryColor(project.category)}>{project.categoryName}</Tag>
          </div>
        }
        bordered={false}
      >
        <div className="project-video-container">
          {project.videoUrl ? (
            <video
              ref={videoRef}
              controls
              width="100%"
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnded}
              onTimeUpdate={handleVideoTimeUpdate}
              poster={project.coverImageUrl || ''}
            >
              <source src={project.videoUrl} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
          ) : (
            <div className="no-video-placeholder">
              <PlayCircleOutlined style={{ fontSize: 60 }} />
              <Text>此项目没有视频</Text>
            </div>
          )}
        </div>
        
        <div className="progress-container">
          <Row align="middle" gutter={16}>
            <Col span={18}>
              <Progress
                percent={watchProgress}
                status={isWatched ? "success" : "active"}
                strokeColor={isWatched ? "#52c41a" : "#1890ff"}
              />
            </Col>
            <Col span={6}>
              {isWatched ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  已完成 {project.pointsReward && `+${project.pointsReward}积分`}
                </Tag>
              ) : (
                <Text type="secondary">观看进度: {watchProgress}%</Text>
              )}
            </Col>
          </Row>
        </div>
        
        <div className="project-info-container">
          <Title level={4}>项目信息</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>讲师:</Text> {project.manager}
            </Col>
            <Col span={12}>
              <Text strong>时长:</Text> {project.duration ? `${project.duration}分钟` : '未知'}
            </Col>
            <Col span={12}>
              <Text strong>积分奖励:</Text> {project.pointsReward || 0}
            </Col>
            <Col span={12}>
              <Text strong>观看次数:</Text> {project.viewCount || 0}
            </Col>
          </Row>
          
          <Title level={4} style={{ marginTop: 20 }}>项目简介</Title>
          <Paragraph>{project.description || '暂无简介'}</Paragraph>
        </div>
        
        <div className="actions-container">
          {!isWatched && project.videoUrl && (
            <Button 
              type="primary" 
              ghost 
              onClick={completeProject}
              disabled={watchProgress < 90}
            >
              标记为已完成
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProjectViewer; 