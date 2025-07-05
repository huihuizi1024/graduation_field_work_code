import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Empty, Spin, Typography, Tag, Pagination, message, Button, Breadcrumb, Tabs, Divider } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, HomeOutlined, AppstoreOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';
import './CategoryVideoPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
      description: '专业技能学习视频，提升您的职业专业能力',
      icon: '🔧'
    },
    '2': {
      name: '学术教育',
      description: '学术知识与教育资源，助力学术与研究发展',
      icon: '🎓'
    },
    '3': {
      name: '职业发展',
      description: '职业发展与职场进阶视频，助您职场腾飞',
      icon: '📈'
    },
    '4': {
      name: '创新创业',
      description: '创新思维与创业实践，激发创造力与创业精神',
      icon: '💡'
    },
    '5': {
      name: '人文艺术',
      description: '人文艺术与兴趣培养，丰富精神世界',
      icon: '🎨'
    },
    '6': {
      name: '科学技术',
      description: '科学技术前沿，探索未知与科技创新',
      icon: '🔬'
    }
  };

  // 获取当前分类信息
  const currentCategory = categoryMap[category] || {
    name: '全部视频',
    description: '探索各类优质学习视频，提升自我',
    icon: '🎬'
  };

  // 获取分类视频
  const fetchCategoryVideos = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      // 检查category参数是否存在，不存在则使用默认分类1
      const categoryId = category ? parseInt(category, 10) : 1;
      
      console.log(`正在获取分类 ${categoryId} 的视频, 页码: ${page}, 每页数量: ${pageSize}`);
      
      const response = await api.get(`/api/projects/by-category/${categoryId}`, {
        params: {
          page: page,
          size: pageSize
        }
      });

      if (response && response.code === 200) {
        const data = response.data || {};
        setVideos(data.records || []);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: data.total || 0
        });
      } else {
        console.error('获取视频失败:', response?.message || '未知错误');
        message.error(`获取视频失败: ${response?.message || '未知错误'}`);
        setVideos([]);
      }
    } catch (error) {
      console.error('获取视频API异常:', error);
      message.error('获取视频失败，请稍后再试');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // 分页变化
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize
    });
    fetchCategoryVideos(page, pageSize);
  };

  // 分类切换
  const handleCategoryChange = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // 监听分类变化，重新加载数据
  useEffect(() => {
    // 如果未指定分类，默认加载分类1
    if (!category) {
      navigate('/category/1', { replace: true });
      return;
    }
    
    // 重置分页到第一页
    setPagination({
      ...pagination,
      current: 1
    });
    
    // 获取指定分类的视频
    fetchCategoryVideos(1, pagination.pageSize);
  }, [category, navigate]);

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
              <Text type="secondary">{item.manager || '未知讲师'}</Text>
            </div>
            <div className="video-card-stats">
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
      {/* 顶部导航区 */}
      <div className="nav-header">
        <div className="breadcrumb-container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">
                <HomeOutlined /> 首页
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <AppstoreOutlined /> 视频分类
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {currentCategory.icon} {currentCategory.name}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Button 
            className="home-btn"
            type="primary" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </div>

      {/* 分类标题区 */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <span className="category-icon">{currentCategory.icon}</span>
            <div className="title-info">
              <Title level={2}>{currentCategory.name}</Title>
              <Text type="secondary">{currentCategory.description}</Text>
            </div>
          </div>
        </div>
      </div>
      
      {/* 分类导航标签页 */}
      <div className="category-tabs">
        <Tabs 
          activeKey={category} 
          onChange={handleCategoryChange}
          centered
        >
          {Object.entries(categoryMap).map(([key, value]) => (
            <TabPane 
              tab={
                <span>
                  <span className="tab-icon">{value.icon}</span> {value.name}
                </span>
              } 
              key={key} 
            />
          ))}
        </Tabs>
      </div>
      
      <Divider />

      {/* 内容区域 */}
      <div className="page-content">
        <Spin spinning={loading} size="large">
          {videos.length === 0 && !loading ? (
            <Empty
              description={`暂无 "${currentCategory.name}" 分类下的视频`}
              style={{ marginTop: '50px' }}
            />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {videos.map(item => (
                  <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                    {renderVideoCard(item)}
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
        </Spin>
      </div>
    </div>
  );
};

export default CategoryVideoPage; 