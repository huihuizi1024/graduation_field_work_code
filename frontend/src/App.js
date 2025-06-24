import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { UserOutlined, SettingOutlined, ScheduleOutlined } from '@ant-design/icons';
import PointRuleList from './components/PointRuleList';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

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
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<ScheduleOutlined />}>
            积分规则管理
          </Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>
            转换规则管理
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            机构管理
          </Menu.Item>
          {/* 更多菜单项根据后端API添加 */}
        </Menu>
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
            <PointRuleList /> {/* 这里暂时直接渲染积分规则列表，后续可根据路由渲染不同组件 */}
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