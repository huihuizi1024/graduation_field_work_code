import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { UserOutlined, SettingOutlined, ScheduleOutlined } from '@ant-design/icons';
import PointRuleList from './components/PointRuleList';
import ConversionRuleList from './components/ConversionRuleList';
import CertificationStandardList from './components/CertificationStandardList';
import BusinessProcessList from './components/BusinessProcessList';
import PlatformActivityList from './components/PlatformActivityList';
import TransactionList from './components/TransactionList';
import ProjectList from './components/ProjectList';
import ExpertList from './components/ExpertList';
import AdminUserList from './components/AdminUserList';
import InstitutionList from './components/InstitutionList';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState('1'); // 默认选中积分规则管理

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <PointRuleList />;
      case '2':
        return <ConversionRuleList />;
      case '3':
        return <InstitutionList />;
      case '4':
        return <CertificationStandardList />;
      case '5':
        return <BusinessProcessList />;
      case '6':
        return <PlatformActivityList />;
      case '7':
        return <TransactionList />;
      case '8':
        return <ProjectList />;
      case '9':
        return <ExpertList />;
      case '10':
        return <AdminUserList />;
      default:
        return <PointRuleList />;
    }
  };

  // 菜单项配置
  const menuItems = [
    {
      key: '1',
      icon: <ScheduleOutlined />,
      label: '积分规则管理',
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: '转换规则管理',
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: '机构管理',
    },
    {
      key: '4',
      icon: <ScheduleOutlined />,
      label: '认证标准管理',
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: '业务流程管理',
    },
    {
      key: '6',
      icon: <UserOutlined />,
      label: '平台活动管理',
    },
    {
      key: '7',
      icon: <ScheduleOutlined />,
      label: '交易管理',
    },
    {
      key: '8',
      icon: <SettingOutlined />,
      label: '项目管理',
    },
    {
      key: '9',
      icon: <UserOutlined />,
      label: '专家管理',
    },
    {
      key: '10',
      icon: <ScheduleOutlined />,
      label: '管理用户管理',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div style={{ color: 'white', fontSize: '20px', textAlign: 'center', padding: '16px 0' }}>
          学分银行管理
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          学分银行积分管理系统 ©{new Date().getFullYear()} Created by huihuizi1024
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App; 