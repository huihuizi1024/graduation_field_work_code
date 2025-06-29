import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, GiftOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api';
import './PointsMall.css';

const { Title, Text } = Typography;

const PointsMall = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pointsLoading, setPointsLoading] = useState(false);

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    setPointsLoading(true);
    try {
      const response = await getCurrentUser();
      const userData = response.data;
      setUserInfo({
        ...userData,
        pointsBalance: userData.pointsBalance || 0
      });
      // 更新localStorage缓存
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setPointsLoading(false);
    }
  };

  // 模拟商品数据（实际项目中应该从API获取）
  const mockProducts = [
    {
      id: 1,
      name: '高级学习笔记本',
      description: '优质纸张，方便记录学习笔记',
      points: 500,
      image: 'https://img.freepik.com/free-psd/notebook-mockup_1310-1458.jpg',
      category: '学习用品'
    },
    {
      id: 2,
      name: 'Python编程入门课程',
      description: '零基础入门Python编程的在线课程',
      points: 2000,
      image: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
      category: '在线课程'
    },
    {
      id: 3,
      name: '便携式电子词典',
      description: '随时随地查询单词，提升学习效率',
      points: 1500,
      image: 'https://img.freepik.com/free-vector/electronic-dictionary-abstract-concept-illustration_335657-3875.jpg',
      category: '学习工具'
    },
    {
      id: 4,
      name: '职业规划咨询课程',
      description: '一对一职业发展指导课程',
      points: 3000,
      image: 'https://img.freepik.com/free-photo/business-planning-concept-with-wooden-blocks-papers_176474-7323.jpg',
      category: '咨询服务'
    },
    {
      id: 5,
      name: '智能学习平板',
      description: '支持手写笔记的学习平板',
      points: 5000,
      image: 'https://img.freepik.com/free-psd/digital-tablet-mockup_1310-706.jpg',
      category: '电子设备'
    },
    {
      id: 6,
      name: '英语口语课程',
      description: '实用英语口语训练课程',
      points: 2500,
      image: 'https://img.freepik.com/free-photo/english-british-england-language-education-concept_53876-124286.jpg',
      category: '在线课程'
    }
  ];

  useEffect(() => {
    // 先从localStorage读取用户信息
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析localStorage用户信息失败:', error);
      }
    }
    
    // 仍然从API获取最新用户信息
    fetchCurrentUser();
    // 设置商品数据
    setProducts(mockProducts);
  }, []);

  // 兑换商品
  const handleExchange = async (product) => {
    if (!userInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (userInfo.pointsBalance < product.points) {
      message.error('积分不足');
      return;
    }

    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('兑换成功！');
      // 更新用户积分（实际项目中应该调用API）
      const newUserInfo = {
        ...userInfo,
        pointsBalance: userInfo.pointsBalance - product.points
      };
      setUserInfo(newUserInfo);
    } catch (error) {
      message.error('兑换失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const onBackToMain = () => {
    navigate(-1);
  };

  return (
    <div className="points-mall">
      <div className="points-header">
        <div className="header-left">
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBackToMain}
            style={{ marginRight: '16px' }}
          >
            返回
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <GiftOutlined /> 积分商城
          </Title>
        </div>
        <div className="points-info">
        {pointsLoading ? (
            <Tag color="blue" icon={<UserOutlined />}>
              加载中...
            </Tag>
          ) : (
            <Tag color="blue" icon={<UserOutlined />}>
              当前积分：{userInfo?.pointsBalance || 0}
            </Tag>
          )}
        </div>
      </div>

      <Row gutter={[16, 16]} className="products-list">
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleExchange(product)}
                  loading={loading}
                >
                  兑换
                </Button>
              ]}
            >
              <Card.Meta
                title={product.name}
                description={
                  <>
                    <Text>{product.description}</Text>
                    <div className="product-points">
                      <Tag color="gold">{product.points} 积分</Tag>
                      <Tag color="blue">{product.category}</Tag>
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PointsMall;
