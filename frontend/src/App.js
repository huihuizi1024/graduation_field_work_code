import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import AdminPage from './components/AdminPage';
import SkillCertificationPage from './components/SkillCertificationPage';
import InterestTrainingPage from './components/InterestTrainingPage';
import LifeSkillsPage from './components/LifeSkillsPage';
import CareerAdvancePage from './components/CareerAdvancePage';
import SeniorEducationPage from './components/SeniorEducationPage';
import EducationPromotionPage from './components/EducationPromotionPage';
import PointsMall from './components/PointsMall';
import UserProfile from './components/UserProfile';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'admin') {
      setCurrentPage('admin');
      navigate('/admin');
    } else {
      setCurrentPage('main');
      navigate('/');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentPage('main');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    navigate('/');
  };

  // 统一的页面跳转处理函数
  const handlePageChange = (page) => {
    setCurrentPage(page);
    switch (page) {
      case 'skill':
        navigate('/skill-certification');
        break;
      case 'interest':
        navigate('/interest-training');
        break;
      case 'life':
        navigate('/life-skills');
        break;
      case 'careerAdvance':
        navigate('/career-advance');
        break;
      case 'senior':
        navigate('/senior-education');
        break;
      case 'education':
        navigate('/education-promotion');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <MainPage 
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onLogout={handleLogout}
            onLoginClick={() => handlePageChange('login')}
            onGoToSkillCertification={() => handlePageChange('skill')}
            onGoToInterestTraining={() => handlePageChange('interest')}
            onGoToLifeSkills={() => handlePageChange('life')}
            onCareerAdvance={() => handlePageChange('careerAdvance')}
            onGoToSeniorEducation={() => handlePageChange('senior')}
            onGoToEducationPromotion={() => handlePageChange('education')}
          />
        } 
      />
      <Route 
        path="/login" 
        element={
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => handlePageChange('register')}
            onBackToMain={handleBackToMain}
          />
        } 
      />
      <Route 
        path="/register" 
        element={
          <Register 
            onBackToLogin={() => handlePageChange('login')}
            onBackToMain={handleBackToMain}
          />
        } 
      />
      <Route 
        path="/points-mall" 
        element={
          isLoggedIn ? (
            <PointsMall onBackToMain={handleBackToMain} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/profile" 
        element={
          isLoggedIn ? (
            <UserProfile onBackToMain={handleBackToMain} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/admin" 
        element={
          isLoggedIn && userRole === 'admin' ? (
            <AdminPage onLogout={handleLogout} onBackToMain={handleBackToMain} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="/skill-certification" element={<SkillCertificationPage onBackToMain={handleBackToMain} />} />
      <Route path="/interest-training" element={<InterestTrainingPage onBackToMain={handleBackToMain} />} />
      <Route path="/life-skills" element={<LifeSkillsPage onBackToMain={handleBackToMain} />} />
      <Route path="/career-advance" element={<CareerAdvancePage onBackToMain={handleBackToMain} />} />
      <Route path="/senior-education" element={<SeniorEducationPage onBackToMain={handleBackToMain} />} />
      <Route path="/education-promotion" element={<EducationPromotionPage onBackToMain={handleBackToMain} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
