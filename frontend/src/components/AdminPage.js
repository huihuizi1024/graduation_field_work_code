import React from 'react';

const AdminPage = ({ onLogout }) => {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>管理员管理平台</h1>
      <p>欢迎来到学分银行系统后台管理平台！</p>
      <button onClick={onLogout} style={{ marginTop: 20, padding: '8px 24px', fontSize: 16 }}>退出登录</button>
    </div>
  );
};

export default AdminPage; 