import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, message, Modal, Form, Input, Spin, Empty, Tabs, Table, Badge, Tooltip } from 'antd';
import { UserOutlined, ShoppingCartOutlined, GiftOutlined, ArrowLeftOutlined, PhoneOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getPointRules } from '../api';
import './PointsMall.css';
import * as productAPI from '../api/product';
import * as orderAPI from '../api/order';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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
  const [pointRules, setPointRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(false);

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

  // 获取积分规则
  const fetchPointRules = async () => {
    setRulesLoading(true);
    try {
      const response = await getPointRules({
        page: 0,
        size: 50,
        status: 1, // 只获取有效的规则
        reviewStatus: 1 // 只获取审核通过的规则
      });
      
      if (response && response.code === 200 && response.data && response.data.records) {
        setPointRules(response.data.records);
      } else {
        console.log('没有找到积分规则数据');
        setPointRules([]);
      }
    } catch (error) {
      console.error('获取积分规则失败:', error);
      setPointRules([]);
    } finally {
      setRulesLoading(false);
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
    // 获取积分规则
    fetchPointRules();
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
      
      console.log('发送购买请求:', purchaseData);
      const response = await orderAPI.purchaseProduct(purchaseData);
      console.log('购买响应:', response);
      
      if (response.code === 200) {
        message.success('兑换成功！');
        setIsModalVisible(false);
        
        // 立即更新本地积分显示（防止延迟）
        if (userInfo && selectedProduct) {
          const newBalance = userInfo.pointsBalance - selectedProduct.points;
          console.log('更新积分余额:', userInfo.pointsBalance, '-', selectedProduct.points, '=', newBalance);
          
          const updatedUserInfo = {
            ...userInfo,
            pointsBalance: newBalance
          };
          
          setUserInfo(updatedUserInfo);
          localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        }
        
        // 延迟从服务器获取最新数据确保一致性
        setTimeout(async () => {
          try {
            await fetchCurrentUser();
            console.log('已刷新用户积分数据');
          } catch (error) {
            console.error('刷新用户数据失败:', error);
          }
        }, 1000);
        
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

  // 积分规则表格列定义
  const pointRuleColumns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '积分类型',
      dataIndex: 'pointType',
      key: 'pointType',
      render: (type) => {
        let color, text;
        switch (type) {
          case 1:
            color = 'blue';
            text = '学习积分';
            break;
          case 2:
            color = 'green';
            text = '活动积分';
            break;
          case 3:
            color = 'purple';
            text = '贡献积分';
            break;
          default:
            color = 'default';
            text = '其他积分';
        }
        return <Badge color={color} text={text} />;
      }
    },
    {
      title: '积分值',
      dataIndex: 'pointValue',
      key: 'pointValue',
      render: (value) => <Tag color="green">{value}</Tag>
    },
    {
      title: '有效期',
      key: 'validity',
      render: (_, record) => {
        let validityText;
        switch (record.validityType) {
          case 1:
            validityText = '永久有效';
            break;
          case 2:
            validityText = '固定期限';
            break;
          case 3:
            validityText = `${record.validityDays || 0} 天`;
            break;
          default:
            validityText = '未知';
        }
        return validityText;
      }
    },
    {
      title: '规则说明',
      dataIndex: 'ruleDescription',
      key: 'ruleDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description || '暂无说明'}>
          <Text ellipsis style={{ maxWidth: 200 }}>{description || '暂无说明'}</Text>
        </Tooltip>
      )
    },
  ];

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

      <Tabs defaultActiveKey="products" className="points-mall-tabs">
        <TabPane tab="积分商品" key="products">
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
            <Empty description="暂无商品" style={{ marginTop: '50px' }} />
      )}
        </TabPane>
        <TabPane tab="积分规则" key="rules">
          <div className="rules-container">
            <Card title={<div><InfoCircleOutlined /> 积分获取规则</div>} className="rules-card">
              {rulesLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin />
                </div>
              ) : pointRules.length > 0 ? (
                <Table 
                  dataSource={pointRules} 
                  columns={pointRuleColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ) : (
                <Empty description="暂无积分规则" />
              )}
            </Card>
            
            <Card title="积分使用说明" className="rules-card" style={{ marginTop: '20px' }}>
              <Paragraph>
                <ul>
                  <li>积分可用于兑换商城中的实物商品、课程优惠券和其他服务</li>
                  <li>兑换商品时，系统会自动从您的账户中扣除相应积分</li>
                  <li>一旦兑换成功，积分将无法退还</li>
                  <li>部分积分有有效期限制，请及时使用</li>
                  <li>如对积分有疑问，请联系客服</li>
                </ul>
              </Paragraph>
            </Card>
          </div>
        </TabPane>
      </Tabs>

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
