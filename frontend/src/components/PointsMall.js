import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, message, Modal, Form, Input, Spin, Empty } from 'antd';
import { UserOutlined, ShoppingCartOutlined, GiftOutlined, ArrowLeftOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api';
import './PointsMall.css';
import * as productAPI from '../api/product';
import * as orderAPI from '../api/order';

const { Title, Text } = Typography;

const PointsMall = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [form] = Form.useForm();

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

    // 从后端获取商品列表
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getProducts({ 
          page: 0, 
          size: 20,
          status: 1 // 只获取上架的商品
        });
        
        if (response.code === 200 && response.data && response.data.records) {
          setProducts(response.data.records);
        } else {
          // 如果没有数据，使用本地mock数据
          setProducts(mockProducts);
        }
      } catch (e) {
        console.error('获取商品列表失败，使用本地mock', e);
        // 使用mock数据
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // 从API获取最新用户信息
    fetchCurrentUser();
  }, []);

  // 本地占位数据
  const mockProducts = [
    {
      id: 1,
      name: '高级学习笔记本',
      description: '优质纸张，方便记录学习笔记',
      points: 500,
      imageUrl: 'https://img.freepik.com/free-psd/notebook-mockup_1310-1458.jpg',
      category: '学习用品',
      stock: 100
    },
    {
      id: 2,
      name: 'Python编程入门课程',
      description: '零基础入门Python编程的在线课程',
      points: 2000,
      imageUrl: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
      category: '在线课程',
      stock: 50
    },
    {
      id: 3,
      name: '便携式电子词典',
      description: '随时随地查询单词，提升学习效率',
      points: 1500,
      imageUrl: 'https://img.freepik.com/free-vector/electronic-dictionary-abstract-concept-illustration_335657-3875.jpg',
      category: '学习工具',
      stock: 30
    },
    {
      id: 4,
      name: '职业规划咨询课程',
      description: '一对一职业发展指导课程',
      points: 3000,
      imageUrl: 'https://img.freepik.com/free-photo/business-planning-concept-with-wooden-blocks-papers_176474-7323.jpg',
      category: '咨询服务',
      stock: 20
    },
    {
      id: 5,
      name: '智能学习平板',
      description: '支持手写笔记的学习平板',
      points: 5000,
      imageUrl: 'https://img.freepik.com/free-psd/digital-tablet-mockup_1310-706.jpg',
      category: '电子设备',
      stock: 10
    },
    {
      id: 6,
      name: '英语口语课程',
      description: '实用英语口语训练课程',
      points: 2500,
      imageUrl: 'https://img.freepik.com/free-photo/english-british-england-language-education-concept_53876-124286.jpg',
      category: '在线课程',
      stock: 40
    }
  ];

  // 显示兑换弹窗
  const showPurchaseModal = (product) => {
    if (!userInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (userInfo.pointsBalance < product.points) {
      message.error('积分不足');
      return;
    }

    setSelectedProduct(product);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // 提交兑换
  const handlePurchase = async () => {
    try {
      const values = await form.validateFields();
      setPurchaseLoading(true);
      
      const purchaseData = {
        productId: selectedProduct.id,
        shippingAddress: values.address,
        contactName: values.name,
        contactPhone: values.phone,
        remark: values.remark || ''
      };
      
      const response = await orderAPI.purchaseProduct(purchaseData);
      
      if (response.code === 200) {
        message.success('兑换成功！');
        setIsModalVisible(false);
        // 更新用户积分
        fetchCurrentUser();
      } else {
        message.error(response.message || '兑换失败，请稍后重试');
      }
    } catch (error) {
      console.error('购买失败:', error);
      message.error('兑换失败，请检查表单并稍后重试');
    } finally {
      setPurchaseLoading(false);
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
            <>
            <Tag color="blue" icon={<UserOutlined />}>
              当前积分：{userInfo?.pointsBalance || 0}
            </Tag>
              <Button type="primary" onClick={() => navigate('/my-orders')} style={{ marginLeft: '10px' }}>
                我的订单
              </Button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
      <Row gutter={[16, 16]} className="products-list">
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
                cover={<img alt={product.name} src={product.imageUrl || 'https://img.freepik.com/free-psd/notebook-mockup_1310-1458.jpg'} />}
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                    onClick={() => showPurchaseModal(product)}
                    disabled={product.stock <= 0}
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
                        {product.stock <= 0 ? (
                          <Tag color="red">已售罄</Tag>
                        ) : (
                          <Tag color="green">库存: {product.stock}</Tag>
                        )}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      ) : (
        <Empty description="暂无商品" />
      )}

      <Modal
        title="填写收货信息"
        open={isModalVisible}
        onOk={handlePurchase}
        onCancel={handleCancel}
        confirmLoading={purchaseLoading}
      >
        {selectedProduct && (
          <div style={{ marginBottom: 16 }}>
            <p>商品: {selectedProduct.name}</p>
            <p>积分: <Tag color="gold">{selectedProduct.points}</Tag></p>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="收货人"
            rules={[{ required: true, message: '请输入收货人姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入收货人姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="address"
            label="收货地址"
            rules={[{ required: true, message: '请输入详细收货地址' }]}
          >
            <Input.TextArea prefix={<HomeOutlined />} placeholder="请输入详细收货地址" rows={3} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="可选，请输入备注信息" rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsMall;
