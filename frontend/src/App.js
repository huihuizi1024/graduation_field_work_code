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
import ExpertProfile from './components/ExpertProfile';
import InstitutionProfile from './components/InstitutionProfile';
import UserOrders from './components/UserOrders';

// A simple component to check for authentication
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// A simple component to check for admin role
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');
  return isAuthenticated && role === '4' ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const navigate = useNavigate();

  // This can be simplified further if not used by many components
  const handlePageChange = (path) => {
    navigate(path);
  };

  // 添加退出登录函数
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <MainPage 
            onGoToSkillCertification={() => handlePageChange('/skill-certification')}
            onGoToInterestTraining={() => handlePageChange('/interest-training')}
            onGoToLifeSkills={() => handlePageChange('/life-skills')}
            onCareerAdvance={() => handlePageChange('/career-advance')}
            onGoToSeniorEducation={() => handlePageChange('/senior-education')}
            onGoToEducationPromotion={() => handlePageChange('/education-promotion')}
          />
        } 
      />
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/register" 
        element={<Register />} 
      />
      <Route 
        path="/points-mall" 
        element={<PrivateRoute><PointsMall /></PrivateRoute>} 
      />
      <Route 
        path="/profile" 
        element={<PrivateRoute><UserProfile /></PrivateRoute>} 
      />
       <Route 
        path="/expert/profile" 
        element={<PrivateRoute><ExpertProfile /></PrivateRoute>} 
      />
      <Route 
        path="/institution/profile" 
        element={<PrivateRoute><InstitutionProfile /></PrivateRoute>} 
      />
      <Route 
        path="/my-orders" 
        element={<PrivateRoute><UserOrders /></PrivateRoute>} 
      />
      <Route 
        path="/admin" 
        element={<AdminRoute><AdminPage onLogout={handleLogout} /></AdminRoute>} 
      />
      <Route path="/skill-certification" element={<SkillCertificationPage />} />
      <Route path="/interest-training" element={<InterestTrainingPage />} />
      <Route path="/life-skills" element={<LifeSkillsPage />} />
      <Route path="/career-advance" element={<CareerAdvancePage />} />
      <Route path="/senior-education" element={<SeniorEducationPage />} />
      <Route path="/education-promotion" element={<EducationPromotionPage />} />
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
