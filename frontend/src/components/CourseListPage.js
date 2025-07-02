import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Input, Select, Spin, Empty, Pagination, Typography, Tag, Divider } from 'antd';
import { SearchOutlined, PlayCircleOutlined, FireOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import api from '../api';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

// 课程分类映射
const CATEGORIES = {
  1: { name: '生活技能', icon: '🏠', description: '提升日常生活中的实用技能' },
  2: { name: '职场进阶', icon: '💼', description: '助力职场发展的实用课程' },
  3: { name: '老年教育', icon: '👴', description: '丰富晚年生活的学习资源' },
  4: { name: '学历提升', icon: '🎓', description: '帮助提升学历层次的教育课程' },
  5: { name: '兴趣培养', icon: '🎨', description: '培养兴趣爱好的多元课程' },
  6: { name: '技能认证', icon: '⚒️', description: '获取职业技能认证的专业课程' }
};

const CourseListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState(parseInt(categoryId) || 1);

  useEffect(() => {
    if (categoryId && parseInt(categoryId) !== category) {
      setCategory(parseInt(categoryId));
    }
    fetchCourses();
  }, [category, pagination.current, sortBy, categoryId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // 构造API请求参数
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        category: category,
      };
      
      // 添加排序参数
      switch (sortBy) {
        case 'popular':
          params.sortBy = 'viewCount';
          params.sortDirection = 'desc';
          break;
        case 'latest':
          params.sortBy = 'createTime';
          params.sortDirection = 'desc';
          break;
        default:
          break;
      }
      
      // 如果有搜索词，添加搜索参数
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await api.get('/api/courses', { params });
      
      if (response.code === 200) {
        setCourses(response.data.records || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0
        });
      } else {
        console.error('Failed to fetch courses:', response.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchCourses();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    navigate(`/category/${value}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current: page });
  };

  // 渲染课程卡片
  const renderCourseCard = (course) => (
    <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
            <img 
              alt={course.projectName}
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
                <span>{CATEGORIES[course.category]?.name || '未分类'}</span>
                <span>{course.duration || '--'}分钟</span>
              </div>
            </div>
            {course.viewCount > 10 && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px',
                  background: 'rgba(255, 87, 51, 0.8)',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <FireOutlined style={{ color: '#fff', fontSize: '12px' }} />
                <span style={{ color: '#fff', fontSize: '12px' }}>{course.viewCount}</span>
              </div>
            )}
          </div>
        }
        actions={[
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />}
            onClick={() => handleCourseClick(course.id)}
            style={{ borderRadius: '15px' }}
          >
            开始学习
          </Button>
        ]}
      >
        <Meta
          title={
            <div style={{ height: '44px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {course.projectName}
            </div>
          }
          description={
            <div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(0, 0, 0, 0.45)' }}>
                <span>讲师: {course.manager || '未知'}</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag color="green">积分 +{course.pointsReward || 0}</Tag>
              </div>
            </div>
          }
        />
      </Card>
    </Col>
  );

  // 获取当前分类信息
  const currentCategory = CATEGORIES[category] || CATEGORIES[1];

  return (
    <div className="course-list-page" style={{ padding: '20px' }}>
      {/* 分类标题 */}
      <div className="category-header" style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <span style={{ marginRight: '10px' }}>{currentCategory.icon}</span>
          {currentCategory.name}
        </Title>
        <Text type="secondary">{currentCategory.description}</Text>
      </div>

      {/* 过滤和搜索区 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={10}>
          <Input
            placeholder="搜索课程"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: '100%' }}
            allowClear
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Button 
            type="primary" 
            onClick={handleSearch} 
            icon={<SearchOutlined />}
            style={{ width: '100%' }}
          >
            搜索
          </Button>
        </Col>
      </Row>

      {/* 筛选器 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterOutlined /> 
            <span>分类:</span>
            <Select 
              value={category} 
              onChange={handleCategoryChange}
              style={{ width: '140px' }}
            >
              {Object.entries(CATEGORIES).map(([id, cat]) => (
                <Option key={id} value={parseInt(id)}>
                  {cat.icon} {cat.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <SortAscendingOutlined />
            <span>排序:</span>
            <Select 
              defaultValue="latest" 
              onChange={handleSortChange}
              style={{ width: '120px' }}
            >
              <Option value="latest">最新发布</Option>
              <Option value="popular">最多观看</Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Divider />

      {/* 课程列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : courses.length > 0 ? (
        <div>
          <Row gutter={[16, 16]}>
            {courses.map(course => renderCourseCard(course))}
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Pagination 
              current={pagination.current} 
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      ) : (
        <Empty 
          description={searchTerm ? "未找到匹配的课程" : "暂无课程"} 
          style={{ margin: '60px 0' }}
        />
      )}
    </div>
  );
};

export default CourseListPage; 