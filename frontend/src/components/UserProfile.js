import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Upload, Card, Tabs, Badge, Tag, Button, message, Radio } from 'antd';
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
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

// 模拟用户数据
const mockUserData = {
  id: 1,
  username: "student001",
  full_name: "张三",
  role: 1,
  email: "zhangsan@example.com",
  phone: "13800138000",
  points_balance: 2580.50,
  avatar: null
};

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    name: "Python编程入门",
    progress: 60,
    status: "学习中",
    startTime: "2025-06-01"
  },
  {
    id: 2,
    name: "数据结构与算法",
    progress: 100,
    status: "已完成",
    startTime: "2025-05-15"
  }
];

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    productName: "高级学习笔记本",
    points: 500,
    status: "已完成",
    orderTime: "2025-06-20"
  },
  {
    id: 2,
    name: "Python进阶课程",
    points: 2000,
    status: "处理中",
    orderTime: "2025-06-25"
  }
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile');

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
        setUserData(prev => ({
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
              src={userData.avatar} 
              icon={<UserOutlined />}
            />
          </Badge>
        </Upload>
        <div 
          className="points-display-profile"
          onClick={() => navigate('/points-mall')}
          style={{ cursor: 'pointer' }}
        >
          <GiftOutlined /> {userData.points_balance} 积分
        </div>
      </div>
      <Card title="基本信息" extra={<Button type="link" icon={<EditOutlined />}>编辑</Button>}>
        <div className="info-item">
          <span className="label">用户名：</span>
          <span className="value">{userData.username}</span>
        </div>
        <div className="info-item">
          <span className="label">真实姓名：</span>
          <span className="value">{userData.full_name}</span>
        </div>
        <div className="info-item">
          <span className="label">角色：</span>
          <span className="value">
            <Tag color="blue">{userData.role === 1 ? '学生' : '教师'}</Tag>
          </span>
        </div>
        <div className="info-item">
          <span className="label">邮箱：</span>
          <span className="value">{userData.email}</span>
        </div>
        <div className="info-item">
          <span className="label">手机号：</span>
          <span className="value">{userData.phone}</span>
        </div>
      </Card>
    </div>
  );

  // 渲染课程列表
  const renderCourses = () => (
    <div className="courses-container">
      <div className="courses-header">
        <h2>我的课程</h2>
        <div className="courses-filter">
          <Radio.Group defaultValue="all" buttonStyle="solid">
            <Radio.Button value="all">全部课程</Radio.Button>
            <Radio.Button value="learning">学习中</Radio.Button>
            <Radio.Button value="completed">已完成</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className="courses-list">
        {mockCourses.map(course => (
          <Card 
            key={course.id} 
            className="course-card" 
            hoverable
            extra={
              <Tag color={course.status === "已完成" ? "success" : "processing"}>
                {course.status}
              </Tag>
            }
          >
            <div className="course-info">
              <div className="course-title-wrapper">
                <h3 className="course-title">{course.name}</h3>
              </div>
              <div className="course-progress">
                <div className="progress-text">
                  <span>学习进度</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="course-meta">
                <div className="course-time">
                  <ClockCircleOutlined /> 开始时间：{course.startTime}
                </div>
                <Button type="link" icon={<RightOutlined />}>继续学习</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // 渲染订单列表
  const renderOrders = () => (
    <div className="orders-list">
      {mockOrders.map(order => (
        <Card key={order.id} className="order-card">
          <div className="order-info">
            <h3>{order.productName}</h3>
            <div className="order-meta">
              <Tag color="gold">{order.points} 积分</Tag>
              <Tag color={order.status === "已完成" ? "success" : "processing"}>
                {order.status}
              </Tag>
            </div>
            <div className="order-time">
              下单时间：{order.orderTime}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout className="user-profile-layout">
      <div className="profile-header">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回主页
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
            {selectedMenuItem === 'courses' && renderCourses()}
            {selectedMenuItem === 'orders' && renderOrders()}
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
                  <p style={{ color: '#666' }}>积分记录功能开发中...</p>
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