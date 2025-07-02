import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Upload, Card, Tabs, Badge, Tag, Button, message, Radio, Spin, Input, Table, Empty, Row, Col, Statistic, List, Typography, notification } from 'antd';
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
import * as transactionAPI from '../api/transaction';
import dayjs from 'dayjs';
import EditProfileModal from './EditProfileModal'; 
import MyCourses from './MyCourses'; // 导入MyCourses组件
import MyProjects from './MyProjects';
import './UserProfile.css';
import axios from 'axios';
import { getToken } from '../api/index';

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
        avatar: userData.avatar || ''
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
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过2MB！');
        return false;
      }
      
      // 在实际项目中，这里应该调用API上传图片
      // 这里使用FileReader模拟预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        message.success('头像更新成功！');
      };
      reader.readAsDataURL(file);
      return false;
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
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置'
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
            <Upload {...uploadProps}>
              <Badge 
                count={
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      lineHeight: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                    <UploadOutlined style={{ fontSize: '14px' }} />
                  </div>
                } 
                offset={[-12, 85]}
              >
                <Avatar 
                  size={120}
                  src={userInfo.avatar} 
                  icon={<UserOutlined />}
                />
              </Badge>
            </Upload>
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
          onClick={() => navigate(`/user/orders`)}
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
          type="primary" 
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
                <MyCourses />
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
            {selectedMenuItem === 'settings' && (
              <div className="account-settings">
                <Card 
                  title={
                    <span>
                      <SettingOutlined style={{ marginRight: 8 }} />
                      账户设置
                    </span>
                  }
                  bordered={false}
                >
                  <p style={{ color: '#666' }}>账户设置功能开发中...</p>
                </Card>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserProfile;
