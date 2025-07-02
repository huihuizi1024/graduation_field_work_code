import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, List, Typography, Tag, Button, Empty, Spin } from 'antd';
import { PlayCircleOutlined, ReadOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../api/index';
import './ProjectListPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [projects, setProjects] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  });
  const [loading, setLoading] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true
  });

  // 项目分类
  const categories = [
    { key: '1', name: '专业技能', icon: <PlayCircleOutlined /> },
    { key: '2', name: '学术教育', icon: <PlayCircleOutlined /> },
    { key: '3', name: '职业发展', icon: <PlayCircleOutlined /> },
    { key: '4', name: '创新创业', icon: <ReadOutlined /> },
    { key: '5', name: '人文艺术', icon: <PlayCircleOutlined /> },
    { key: '6', name: '科学技术', icon: <PlayCircleOutlined /> }
  ];

  // 获取分类项目
  const fetchCategoryProjects = async (category) => {
    try {
      setLoading(prev => ({ ...prev, [category]: true }));
      
      const response = await axios.get(`/api/projects/by-category/${category}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (response.data.code === 200) {
        setProjects(prev => ({ ...prev, [category]: response.data.data }));
      } else {
        console.error(`获取分类${category}项目失败:`, response.data.message);
      }
    } catch (error) {
      console.error(`获取分类${category}项目失败:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  // 点击分类切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchCategoryProjects(key);
  };

  // 初始加载
  useEffect(() => {
    fetchCategoryProjects(activeTab);
  }, []);

  // 渲染项目卡片
  const renderProjectCard = (item) => (
    <Card
      hoverable
      className="project-card"
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
          {item.pointsReward > 0 && (
            <div className="project-points-badge">
              <Tag color="gold">{item.pointsReward}积分</Tag>
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
            <Text type="secondary">{item.manager}</Text>
            {item.watchProgress > 0 && (
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-inner" 
                    style={{ width: `${item.watchProgress}%` }}
                  ></div>
                </div>
                <Text type="secondary">{item.watchProgress}%</Text>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );

  return (
    <div className="project-list-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>项目分类</Title>
          <Text type="secondary">探索各类优质学习项目，提升自我</Text>
        </div>
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {categories.map(category => (
          <TabPane 
            tab={
              <span>
                {category.icon} {category.name}
              </span>
            } 
            key={category.key}
          >
            {loading[category.key] ? (
              <div className="loading-container">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : projects[category.key].length === 0 ? (
              <Empty description="暂无项目" />
            ) : (
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
                dataSource={projects[category.key]}
                renderItem={renderProjectCard}
              />
            )}

            <div className="view-more">
              <Button 
                type="primary" 
                ghost
                onClick={() => navigate(`/projects?category=${category.key}`)}
              >
                查看更多{category.name}项目
              </Button>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectListPage; 