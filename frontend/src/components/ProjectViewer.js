import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Progress, Row, Col, Typography, notification, Spin, Tag } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getToken } from '../api/index';
import './ProjectViewer.css';

const { Title, Text, Paragraph } = Typography;

// 添加全局请求锁，避免重复请求
let isCompletionRequestInProgress = false;

const ProjectViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const completionAttemptedRef = useRef(false); // 添加引用，跟踪是否已尝试完成
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isWatched, setIsWatched] = useState(false);
  const [completionInProgress, setCompletionInProgress] = useState(false);
  
  useEffect(() => {
    fetchProjectDetails();
    
    // 清理函数：当组件卸载时停止进度记录
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // 重置全局锁
      isCompletionRequestInProgress = false;
    };
  }, [id]);
  
  // 添加防抖函数
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
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
    // 使用全局锁和引用状态，增强重复调用检查
    if (isWatched || completionInProgress || isCompletionRequestInProgress || completionAttemptedRef.current) {
      console.log('项目已完成或正在处理完成请求，跳过重复请求');
      return;
    }
    
    try {
      console.log('开始标记项目完成，设置completionInProgress=true');
      // 设置所有锁
      setCompletionInProgress(true);
      isCompletionRequestInProgress = true;
      completionAttemptedRef.current = true;
      
      // 首先确保进度记录为100%
      await recordProgress(100);
      
      // 再次检查，防止期间状态已变更
      if (isWatched) {
        console.log('项目已在其他流程中完成，跳过重复请求');
        setCompletionInProgress(false);
        isCompletionRequestInProgress = false;
        return;
      }
      
      const response = await axios.post(`/api/projects/${id}/complete`, {
        clientTimestamp: new Date().getTime(), // 添加时间戳，让后端有机会检测重复请求
        requestId: Math.random().toString(36).substring(2, 15) // 添加随机请求ID
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.data.code === 200) {
        setIsWatched(true);
        setWatchProgress(100); // 确保本地进度也为100%
        console.log('项目标记完成成功，获得积分奖励');
        notification.success({
          message: '恭喜！',
          description: '您已完成项目观看，获得积分奖励！',
          placement: 'topRight',
          key: 'completion-notification' // 添加唯一key，避免重复通知
        });
      } else {
        console.error('标记完成失败，返回状态:', response.data.code, response.data.message);
        // 即使服务器端失败，也在前端标记为已完成状态，提升用户体验
        setIsWatched(true);
        setWatchProgress(100);
        notification.warning({
          message: '项目已标记为完成',
          description: '由于服务器暂时问题，积分可能稍后到账',
          placement: 'topRight',
          key: 'completion-error-notification' // 添加唯一key，避免重复通知
        });
      }
    } catch (error) {
      console.error('标记项目完成失败:', error);
      // 即使出现错误，也在前端标记为已完成状态
      setIsWatched(true);
      setWatchProgress(100);
      notification.warning({
        message: '项目已标记为完成',
        description: '由于服务器暂时问题，积分可能稍后到账',
        placement: 'topRight',
        key: 'completion-error-notification' // 添加唯一key，避免重复通知
      });
    } finally {
      console.log('完成标记项目流程，设置completionInProgress=false');
      setCompletionInProgress(false); // 无论成功或失败，都标记为已完成处理
      // 请求完成后延迟一段时间再重置全局锁，避免重复调用
      setTimeout(() => {
        isCompletionRequestInProgress = false;
      }, 1000);
    }
  };

  // 创建防抖版本的完成项目函数，增加防抖时间
  const debouncedCompleteProject = debounce(completeProject, 800);
  
  // 开始记录观看进度
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // 改为每5秒记录一次观看进度，更快更频繁地记录
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
          
          // 如果达到90%以上，标记为已完成（但只有当尚未尝试完成和尚未观看时）
          if (progress >= 90 && !isWatched && !completionAttemptedRef.current) {
            debouncedCompleteProject();
          }
          
          // 如果视频即将结束(剩余3秒或更少)，提前记录完成进度
          if (duration - currentTime <= 3) {
            recordProgress(100);
          }
        }
      }
    }, 5000); // 改为5秒记录一次
  };
  
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // 创建一个最小化的请求头，只包含必要的认证信息
      const requestOptions = {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          // 移除所有其他可能的默认头部
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        // 禁用凭证，减少 Cookie 传输
        withCredentials: false
      };
      
      const response = await axios.get(`/api/projects/${id}`, requestOptions);
      
      if (response.data.code === 200) {
        setProject(response.data.data);
        
        // 设置初始进度
        if (response.data.data.watchProgress) {
          const progress = response.data.data.watchProgress;
          setWatchProgress(progress);
          
          // 如果进度已经很高(>= 90%)但尚未标记完成，则自动标记完成
          if (progress >= 90 && !response.data.data.isWatched && !completionAttemptedRef.current) {
            console.log('检测到高进度但未完成，自动标记为完成');
            // 设置一个短暂的延迟，确保组件已完全加载
            setTimeout(() => {
              completeProject();
            }, 1000);
          }
        }
        
        // 设置是否已观看
        if (response.data.data.isWatched) {
          setIsWatched(true);
          // 如果已完成，设置尝试完成状态为true，避免重复请求
          completionAttemptedRef.current = true;
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
  
  // 视频事件处理
  const handleVideoPlay = () => {
    startProgressTracking();
  };
  
  const handleVideoEnded = async () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setWatchProgress(100);
    
    try {
      // 先记录100%进度
      await recordProgress(100);
      
      // 只有当尚未尝试完成且尚未观看时，才调用完成函数
      if (!isWatched && !completionAttemptedRef.current && !completionInProgress && !isCompletionRequestInProgress) {
        debouncedCompleteProject();
      }
    } catch (error) {
      console.error('视频结束处理失败:', error);
      
      // 即使发生错误，也在前端标记为已完成
      if (!isWatched && !completionAttemptedRef.current) {
        setIsWatched(true);
        completionAttemptedRef.current = true;
        notification.warning({
          message: '项目已标记为完成',
          description: '由于服务器暂时问题，积分可能稍后到账',
          placement: 'topRight',
          key: 'video-ended-error-notification' // 添加唯一key，避免重复通知
        });
      }
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
              onClick={async () => {
                try {
                  // 检查是否已尝试完成，避免重复请求
                  if (completionAttemptedRef.current || isCompletionRequestInProgress || completionInProgress) {
                    notification.info({
                      message: '请稍等',
                      description: '完成请求正在处理中',
                      placement: 'topRight',
                      key: 'manual-completion-info'
                    });
                    return;
                  }
                  
                  setWatchProgress(100);
                  // 先记录100%进度，再完成项目
                  await recordProgress(100);
                  await completeProject();
                } catch (error) {
                  console.error('手动完成项目失败:', error);
                  notification.error({
                    message: '标记完成失败',
                    description: '请稍后再试',
                    placement: 'topRight',
                    key: 'manual-completion-error'
                  });
                }
              }}
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