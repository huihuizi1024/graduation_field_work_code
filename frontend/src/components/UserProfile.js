import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Upload, Card, Tabs, Badge, Tag, Button, message, Radio, Spin } from 'antd';
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
import { getCurrentUser } from '../api';
import './UserProfile.css';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

const UserProfile = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile');
  const [activeTab, setActiveTab] = useState('1');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      const userData = response.data;
      setUserInfo({
        username: userData.username,
        fullName: userData.fullName,
        role: userData.role === 1 ? '学生' : userData.role === 2 ? '专家' : userData.role === 3 ? '机构' : '管理员',
        email: userData.email,
        phone: userData.phone,
        pointsBalance: userData.pointsBalance,
        institution: userData.institution,
        status: userData.status === 1 ? '正常' : '禁用',
        avatar: userData.avatar
      });
      // 更新localStorage缓存
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
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
    
    // 仍然从API获取最新用户信息
    fetchCurrentUser();
  }, []);

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
      {loading ? (
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
          <Card title="基本信息" extra={<Button type="link" icon={<EditOutlined />}>编辑</Button>}>
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
                <Tag color="blue">{userInfo.role === '学生' ? '学生' : '教师'}</Tag>
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
            {selectedMenuItem === 'courses' && (
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
                  {/* 课程列表渲染逻辑 */}
                </div>
              </div>
            )}
            {selectedMenuItem === 'orders' && (
              <div className="orders-list">
                {/* 订单列表渲染逻辑 */}
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
