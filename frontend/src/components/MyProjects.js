import React, { useState, useEffect } from 'react';
import { List, Card, Avatar, Tag, Progress, Typography, Empty, Spin, Row, Col, Button } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, RightOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../api/index';

const { Title, Text } = Typography;

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects/my-projects', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (response.data.code === 200) {
        setProjects(response.data.data.records || []);
      } else {
        console.error('获取我的项目失败:', response.data.message);
      }
    } catch (error) {
      console.error('获取我的项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Empty 
        description="您还没有观看任何项目" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={() => navigate('/projects')}>
          去浏览项目
        </Button>
      </Empty>
    );
  }

  return (
    <div className="my-projects-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={4}>我的项目</Title>
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={projects}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div className="project-card-cover" onClick={() => navigate(`/projects/${item.id}`)}>
                  {item.coverImageUrl ? (
                    <img alt={item.projectName} src={item.coverImageUrl} />
                  ) : (
                    <div className="project-card-placeholder">
                      <PlayCircleOutlined />
                    </div>
                  )}
                  {item.isWatched && (
                    <div className="project-watched-badge">
                      <CheckCircleOutlined />
                    </div>
                  )}
                </div>
              }
              onClick={() => navigate(`/projects/${item.id}`)}
            >
              <Card.Meta
                title={
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text ellipsis style={{ maxWidth: '180px' }}>{item.projectName}</Text>
                    </Col>
                    <Col>
                      <Tag color={getCategoryColor(item.category)}>{item.categoryName}</Tag>
                    </Col>
                  </Row>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                      {item.manager}
                    </Text>
                    <Progress 
                      percent={item.watchProgress || 0} 
                      size="small" 
                      status={item.isWatched ? "success" : "active"}
                    />
                    <div className="project-card-footer">
                      <div>
                        {item.pointsReward > 0 && (
                          <Tag color="gold">{item.pointsReward} 积分</Tag>
                        )}
                      </div>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${item.id}`);
                        }}
                      >
                        继续观看 <RightOutlined />
                      </Button>
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyProjects; 