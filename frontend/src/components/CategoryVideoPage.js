import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Empty, Spin, Typography, Tag, Pagination, message, Button } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import './CategoryVideoPage.css';

const { Title, Text } = Typography;

const CategoryVideoPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15, // 一页显示15个视频，可以是3行5列
    total: 0
  });
  
  // 分类映射
  const categoryMap = {
    '1': {
      name: '专业技能',
      description: '专业技能学习视频，提升您的职业专业能力'
    },
    '2': {
      name: '学术教育',
      description: '学术知识与教育资源，助力学术与研究发展'
    },
    '3': {
      name: '职业发展',
      description: '职业发展与职场进阶视频，助您职场腾飞'
    },
    '4': {
      name: '创新创业',
      description: '创新思维与创业实践，激发创造力与创业精神'
    },
    '5': {
      name: '人文艺术',
      description: '人文艺术与兴趣培养，丰富精神世界'
    },
    '6': {
      name: '科学技术',
      description: '科学技术前沿，探索未知与科技创新'
    }
  };

  // 获取当前分类信息
  const currentCategory = categoryMap[category] || {
    name: '全部视频',
    description: '探索各类优质学习视频，提升自我'
  };

  // 获取分类视频
  const fetchCategoryVideos = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/projects/by-category/${category}`, {
        params: {
          page,
          size: pageSize
        }
      });

      if (response && response.code === 200) {
        const data = response.data || [];
        // 处理数据是数组还是分页对象的情况
        if (Array.isArray(data)) {
          setVideos(data);
          setPagination({
            ...pagination,
            current: page,
            total: data.length
          });
        } else {
          setVideos(data.records || []);
          setPagination({
            ...pagination,
            current: page,
            total: data.total || 0
          });
        }
      } else {
        message.error(`获取视频失败: ${response?.message || '未知错误'}`);
        setVideos([]);
      }
    } catch (error) {
      console.error(`获取视频失败:`, error);
      message.error('获取视频失败，请稍后再试');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // 分页变化
  const handlePageChange = (page, pageSize) => {
    fetchCategoryVideos(page, pageSize);
  };

  // 初始加载
  useEffect(() => {
    fetchCategoryVideos(pagination.current, pagination.pageSize);
  }, [category]);

  // 渲染视频卡片
  const renderVideoCard = (item) => (
    <Card
      hoverable
      className="video-card"
      cover={
        <div className="video-card-cover" onClick={() => navigate(`/projects/${item.id}`)}>
          {item.coverImageUrl ? (
            <img alt={item.projectName} src={item.coverImageUrl} />
          ) : (
            <div className="video-card-placeholder">
              <PlayCircleOutlined />
            </div>
          )}
          {item.isWatched && (
            <div className="video-watched-badge">
              <CheckCircleOutlined />
            </div>
          )}
          {item.duration && (
            <div className="video-duration-badge">
              {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
            </div>
          )}
        </div>
      }
      onClick={() => navigate(`/projects/${item.id}`)}
    >
      <Card.Meta
        title={item.projectName}
        description={
          <div>
            <div className="video-card-author">
              <Text type="secondary">{item.manager}</Text>
            </div>
            <div className="video-card-stats">
              <span>
                <i className="fas fa-eye"></i> {item.viewCount || 0}
              </span>
              {item.pointsReward > 0 && (
                <Tag color="gold" className="video-points-tag">
                  {item.pointsReward}积分
                </Tag>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );

  return (
    <div className="category-video-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <Title level={2}>{currentCategory.name}</Title>
            <Text type="secondary">{currentCategory.description}</Text>
          </div>
          <Button 
            type="primary" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : videos.length === 0 ? (
        <Empty description="暂无视频" />
      ) : (
        <>
          <Row gutter={[16, 24]}>
            {videos.map((video) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={video.id}>
                {renderVideoCard(video)}
              </Col>
            ))}
          </Row>
          
          <div className="pagination-container">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryVideoPage; 