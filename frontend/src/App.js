import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoToRegister = () => {
    setCurrentPage('register');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('main');
  };

  // 根据当前页面显示不同组件
  if (currentPage === 'login') {
    return (
      <Login 
        onGoToRegister={handleGoToRegister} 
        onBackToMain={handleBackToMain}
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <Register 
        onBackToLogin={() => setCurrentPage('login')} 
        onBackToMain={handleBackToMain}
      />
    );
  }

  // 默认显示主页面
  return (
    <MainPage 
      onLoginClick={handleGoToLogin}
      onLogout={handleLogout}
      isLoggedIn={isLoggedIn}
    />
  );
}

export default App; 