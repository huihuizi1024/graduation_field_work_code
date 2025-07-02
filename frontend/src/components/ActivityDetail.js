import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col, Space, Button, Divider, Skeleton, Image } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api';

const { Title, Paragraph } = Typography;

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityDetail();
  }, [id]);

  const fetchActivityDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/platform-activities/${id}`);
      
      if (response.code === 200 && response.data) {
        // 格式化活动数据
        const activityData = {
          id: response.data.id,
          title: response.data.activityName,
          desc: response.data.activityDescription,
          image: response.data.imageUrl || 'https://picsum.photos/1200/400?random=' + Math.floor(Math.random() * 10),
          startTime: response.data.startTime,
          endTime: response.data.endTime,
          location: response.data.location || '线上',
          organizer: response.data.organizer || '终身学习平台',
          type: response.data.activityType === 1 ? '线上活动' : 
                response.data.activityType === 2 ? '线下活动' : '混合活动'
        };
        setActivity(activityData);
      } else {
        console.error('获取活动详情失败:', response.message);
      }
    } catch (error) {
      console.error('获取活动详情出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 20 }}>
          返回
        </Button>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 20 }}>
          返回
        </Button>
        <Card>
          <Title level={4}>未找到活动信息</Title>
          <Paragraph>抱歉，无法获取此活动的详细信息。</Paragraph>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 20 }}>
        返回
      </Button>
      
      <Card bordered={false} className="activity-detail-card">
        <div className="activity-hero" style={{ marginBottom: '30px' }}>
          <Image
            src={activity.image}
            alt={activity.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
        
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          {activity.title}
        </Title>
        
        <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
          <Col xs={24} sm={24} md={8}>
            <Card className="info-card">
              <Space direction="vertical" size="middle">
                <div className="info-item">
                  <CalendarOutlined className="info-icon" style={{ color: '#1890ff' }} />
                  <div>
                    <div className="info-label">开始时间</div>
                    <div className="info-value">{dayjs(activity.startTime).format('YYYY年MM月DD日 HH:mm')}</div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <Card className="info-card">
              <Space direction="vertical" size="middle">
                <div className="info-item">
                  <CalendarOutlined className="info-icon" style={{ color: '#52c41a' }} />
                  <div>
                    <div className="info-label">结束时间</div>
                    <div className="info-value">{dayjs(activity.endTime).format('YYYY年MM月DD日 HH:mm')}</div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={24} md={8}>
            <Card className="info-card">
              <Space direction="vertical" size="middle">
                <div className="info-item">
                  <EnvironmentOutlined className="info-icon" style={{ color: '#f5222d' }} />
                  <div>
                    <div className="info-label">活动地点</div>
                    <div className="info-value">{activity.location}</div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
          <Col xs={24} sm={12}>
            <Card className="info-card">
              <Space direction="vertical" size="middle">
                <div className="info-item">
                  <TeamOutlined className="info-icon" style={{ color: '#722ed1' }} />
                  <div>
                    <div className="info-label">组织者</div>
                    <div className="info-value">{activity.organizer}</div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card className="info-card">
              <Space direction="vertical" size="middle">
                <div className="info-item">
                  <CalendarOutlined className="info-icon" style={{ color: '#fa8c16' }} />
                  <div>
                    <div className="info-label">活动类型</div>
                    <div className="info-value">{activity.type}</div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Divider style={{ margin: '30px 0' }} />
        
        <div className="activity-description">
          <Title level={3}>活动介绍</Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {activity.desc || '暂无活动详细介绍'}
          </Paragraph>
        </div>
      </Card>
      
      <style jsx="true">{`
        .activity-detail-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-radius: 12px;
        }
        .info-card {
          height: 100%;
          transition: all 0.3s;
          border-radius: 8px;
        }
        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .info-item {
          display: flex;
          align-items: flex-start;
        }
        .info-icon {
          font-size: 24px;
          margin-right: 16px;
          margin-top: 4px;
        }
        .info-label {
          font-size: 14px;
          color: #888;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ActivityDetail; 