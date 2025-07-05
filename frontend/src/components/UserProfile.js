import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Upload, Card, Tabs, Badge, Tag, Button, message, Radio, Spin, Input, Table, Empty, Row, Col, Statistic, List, Typography, notification, Modal, Descriptions, Divider } from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  BookOutlined, 
  ShoppingOutlined, 
  SettingOutlined,
  GiftOutlined,
  HistoryOutlined,
  EditOutlined,
  ClockCircleOutlined,
  RightOutlined,
  HomeOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserInfo } from '../api';
import * as orderAPI from '../api/order';
import * as productAPI from '../api/product';
import * as transactionAPI from '../api/transaction';
import dayjs from 'dayjs';
import EditProfileModal from './EditProfileModal'; 
import MyCourses from './MyCourses'; // 导入MyCourses组件
import MyProjects from './MyProjects';
import './UserProfile.css';
import axios from 'axios';
import { getToken } from '../api/index';
import { validateImage, FILE_SIZE_LIMITS } from '../utils/fileValidator';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const UserProfile = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile');
  const [activeTab, setActiveTab] = useState('1');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      if (!response || !response.data) {
        throw new Error('无效的API响应');
      }
      const userData = response.data;
      setUserInfo({
        username: userData.username || '',
        fullName: userData.fullName || '',
        role: userData.role || 0,
        email: userData.email || '',
        phone: userData.phone || '',
        pointsBalance: userData.pointsBalance || 0,
        institution: userData.institution || '',
        status: userData.status === 1 ? '正常' : '禁用',
        avatar: userData.avatarUrl || userData.avatar || ''
      });
      // 更新localStorage缓存
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户订单
  const fetchUserOrders = async () => {
    if (selectedMenuItem === 'orders') {
      setOrderLoading(true);
      try {
        const response = await orderAPI.getMyOrders();
        if (response.code === 200) {
          setOrders(response.data || []);
        } else {
          message.error('获取订单失败');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('获取订单失败');
      } finally {
        setOrderLoading(false);
      }
    }
  };

  // 获取积分记录
  const fetchPointTransactions = async () => {
    if (selectedMenuItem === 'points') {
      setTransactionLoading(true);
      try {
        const response = await transactionAPI.getMyTransactions();
        if (response.code === 200) {
          setTransactions(response.data || []);
        } else {
          message.error('获取积分记录失败');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        message.error('获取积分记录失败');
      } finally {
        setTransactionLoading(false);
      }
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        // 确保头像字段正确映射
        if (parsedUserInfo.avatarUrl && !parsedUserInfo.avatar) {
          parsedUserInfo.avatar = parsedUserInfo.avatarUrl;
        }
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析localStorage用户信息失败:', error);
      }
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedMenuItem === 'orders') {
      fetchUserOrders();
    } else if (selectedMenuItem === 'points') {
      fetchPointTransactions();
    }
  }, [selectedMenuItem]);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleViewOrder = async (record) => {
    setViewingOrder(record);
    setIsViewModalVisible(true);
    
    // 获取商品详情
    try {
      const response = await productAPI.getProductById(record.productId);
      if (response.code === 200) {
        setProductInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      message.error('获取商品详情失败');
    }
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingOrder(null);
    setProductInfo(null);
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      // This is the actual API call to the backend.
      const response = await updateUserInfo(values); 
      
      if (response && response.code === 200) {
        // Refetch to get the most updated data and update localStorage
        await fetchCurrentUser(); 
        
        setIsModalVisible(false);
        message.success('信息更新成功！');
      } else {
        throw new Error(response?.message || '更新失败');
      }
    } catch (error) {
      message.error('更新失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 头像上传配置
  const uploadProps = {
    name: 'file',
    showUploadList: false,
    action: '/api/upload/file',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    beforeUpload: (file) => {
      // 使用统一的文件验证工具
      if (!validateImage(file)) {
        return false;
      }
      return true; // 继续上传
    },
    onSuccess: async (res) => {
      if (res.code === 200 && res.data?.url) {
        try {
          const updateResponse = await updateUserInfo({ avatarUrl: res.data.url });
          if (updateResponse && updateResponse.code === 200) {
            // 更新本地状态
            const updatedUserInfo = { ...userInfo, avatar: res.data.url };
            setUserInfo(updatedUserInfo);
            
            // 更新localStorage
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            
            // 重新获取用户信息以确保同步
            await fetchCurrentUser();
            
            message.success('头像更新成功！');
          } else {
            message.error('保存头像失败：' + (updateResponse?.message || '未知错误'));
          }
        } catch (e) {
          console.error('保存头像失败:', e);
          message.error('保存头像失败：' + (e.response?.data?.message || e.message));
        }
      } else {
        message.error(res.message || '上传失败');
      }
    },
    onError: () => {
      message.error('上传失败');
    }
  };

  // 菜单项配置
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息'
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: '我的课程'
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: '我的订单'
    },
    {
      key: 'points',
      icon: <GiftOutlined />,
      label: '积分记录'
    }
  ];

  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
  };

  // 渲染个人信息
  const renderProfile = () => (
    <div className="profile-info">
      {loading && !userInfo ? ( // Show spinner only on initial load
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : userInfo ? (
        <>
          <div className="avatar-wrapper">
            <div className="avatar-upload-container">
              <Upload {...uploadProps}>
                <div className="avatar-upload-area">
                  <Avatar 
                    size={200}
                    src={userInfo.avatar} 
                    icon={<UserOutlined style={{ fontSize: '80px' }} />}
                  />
                  <div className="avatar-upload-overlay">
                    <UploadOutlined style={{ color: '#fff' }} />
                    <div style={{ color: '#fff' }}>点击更换头像</div>
                  </div>
                </div>
              </Upload>
              <div className="avatar-upload-button">
                <UploadOutlined style={{ marginRight: '4px' }} />
                点击头像上传
              </div>
            </div>
            <div 
              className="points-display-profile"
              onClick={() => navigate('/points-mall')}
              style={{ cursor: 'pointer' }}
            >
              <GiftOutlined /> {userInfo.pointsBalance} 积分
            </div>
          </div>
            <Card title="基本信息" extra={
              <Button 
                type="link" 
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑
              </Button>
            }>
            <div className="info-item">
              <span className="label">用户名：</span>
              <span className="value">{userInfo.username}</span>
            </div>
            <div className="info-item">
              <span className="label">真实姓名：</span>
              <span className="value">{userInfo.fullName}</span>
            </div>
            <div className="info-item">
              <span className="label">角色：</span>
              <span className="value">
                <Tag color="blue">
                  {userInfo.role === 1 ? '学生' : 
                   userInfo.role === 2 ? '专家' : 
                   userInfo.role === 3 ? '机构' : 
                   userInfo.role === 4 ? '管理员' : '未知角色'}
                </Tag>
              </span>
            </div>
            <div className="info-item">
              <span className="label">邮箱：</span>
              <span className="value">{userInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="label">手机号：</span>
              <span className="value">{userInfo.phone}</span>
            </div>
          </Card>

          {userInfo && (
              <EditProfileModal
                  visible={isModalVisible}
                  onCancel={handleCancelModal}
                  onOk={handleUpdateProfile}
                  initialData={userInfo}
                  role="student" 
              />
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Button type="primary" onClick={() => navigate('/login')}>
            请先登录
          </Button>
        </div>
      )}
    </div>
  );

  // 订单状态标签
  const getOrderStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="gold">待发货</Tag>;
      case 2:
        return <Tag color="blue">已发货</Tag>;
      case 3:
        return <Tag color="green">已完成</Tag>;
      case 4:
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  // 交易类型标签
  const getTransactionTypeTag = (type) => {
    switch (type) {
      case 1:
        return <Tag color="green">获得</Tag>;
      case 2:
        return <Tag color="red">消费</Tag>;
      default:
        return <Tag color="default">其他</Tag>;
    }
  };

  // 订单列表列配置
  const orderColumns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => text || `商品 #${record.productId}`
    },
    {
      title: '消耗积分',
      dataIndex: 'pointsUsed',
      key: 'pointsUsed',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          icon={<EyeOutlined />} 
          size="small" 
          onClick={() => handleViewOrder(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 交易记录列配置
  const transactionColumns = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => getTransactionTypeTag(type)
    },
    {
      title: '积分变动',
      dataIndex: 'pointsChange',
      key: 'pointsChange',
      render: (points, record) => {
        const color = record.transactionType === 1 ? 'green' : 'red';
        const prefix = record.transactionType === 1 ? '+' : '-';
        return <span style={{ color }}>{prefix}{Math.abs(points)}</span>;
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
  ];

  const fetchCompletedProjects = async () => {
    try {
      const response = await axios.get('/api/projects/completed', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (response.data.code === 200) {
        setCompletedProjects(response.data.data || []);
      }
    } catch (error) {
      console.error('获取已完成项目失败:', error);
    }
  };

  return (
    <Layout className="user-profile-layout">
      <div className="profile-header">
        <Button 
          type="link" 
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回首页
        </Button>
      </div>
      <Layout style={{ background: '#f0f2f5', padding: '24px 50px' }}>
        <Sider width={250} className="profile-sider">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenuItem]}
            style={{ height: '100%' }}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px 0', background: 'transparent' }}>
          <Content className="profile-content">
            {selectedMenuItem === 'profile' && renderProfile()}
            {selectedMenuItem === 'courses' && (
              <div className="courses-container">
                <MyCourses isEmbedded={true} />
              </div>
            )}
            {selectedMenuItem === 'orders' && (
              <div className="orders-list">
                <Card 
                  title={
                    <span>
                      <ShoppingOutlined style={{ marginRight: 8 }} />
                      我的订单
                    </span>
                  }
                  bordered={false}
                  extra={
                    <Button type="primary" onClick={() => navigate('/points-mall')}>
                      去积分商城
                    </Button>
                  }
                >
                  <Table 
                    columns={orderColumns} 
                    dataSource={orders} 
                    rowKey="id" 
                    loading={orderLoading}
                    pagination={false}
                    locale={{ emptyText: '暂无订单数据' }}
                  />
                </Card>
              </div>
            )}
            {selectedMenuItem === 'points' && (
              <div className="points-history">
                <Card 
                  title={
                    <span>
                      <HistoryOutlined style={{ marginRight: 8 }} />
                      积分记录
                    </span>
                  }
                  bordered={false}
                >
                  <Table 
                    columns={transactionColumns} 
                    dataSource={transactions} 
                    rowKey="id" 
                    loading={transactionLoading}
                    pagination={false}
                    locale={{ emptyText: '暂无积分记录' }}
                  />
                </Card>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
      {isViewModalVisible && (
        <Modal
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          title="订单详情"
          width={700}
          footer={[
            <Button key="back" onClick={handleViewCancel}>
              关闭
            </Button>
          ]}
        >
          {viewingOrder && (
            <>
              <Descriptions title="订单信息" bordered column={1}>
                <Descriptions.Item label="订单ID">{viewingOrder.id}</Descriptions.Item>
                <Descriptions.Item label="订单状态">{getOrderStatusTag(viewingOrder.orderStatus)}</Descriptions.Item>
                <Descriptions.Item label="消耗积分">{viewingOrder.pointsUsed}</Descriptions.Item>
                <Descriptions.Item label="下单时间">
                  {viewingOrder.createTime ? dayjs(viewingOrder.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </Descriptions.Item>
              </Descriptions>
              
              <Divider />
              
              <Descriptions title="收货信息" bordered column={1}>
                <Descriptions.Item label="收货人">{viewingOrder.contactName}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{viewingOrder.contactPhone}</Descriptions.Item>
                <Descriptions.Item label="收货地址">{viewingOrder.shippingAddress}</Descriptions.Item>
                <Descriptions.Item label="备注">{viewingOrder.remark || '-'}</Descriptions.Item>
              </Descriptions>
              
              <Divider />
              
              {productInfo && (
                <Descriptions title="商品信息" bordered column={1}>
                  <Descriptions.Item label="商品名称">{productInfo.name}</Descriptions.Item>
                  <Descriptions.Item label="商品描述">{productInfo.description}</Descriptions.Item>
                  <Descriptions.Item label="所需积分">{productInfo.points}</Descriptions.Item>
                  <Descriptions.Item label="商品分类">{productInfo.category}</Descriptions.Item>
                  {productInfo.imageUrl && (
                    <Descriptions.Item label="商品图片">
                      <img src={productInfo.imageUrl} alt="商品图片" style={{ maxWidth: '200px' }} />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}
            </>
          )}
        </Modal>
      )}
    </Layout>
  );
};

export default UserProfile;
