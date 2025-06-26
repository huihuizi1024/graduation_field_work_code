import React, { useState } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoToRegister = () => {
    setCurrentPage('register');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('main');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentPage('main');
  };

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

  if (currentPage === 'admin') {
    return <AdminPage onLogout={handleLogout} />;
  }

  if (currentPage === 'skill') {
    return <SkillCertificationPage onBackToMain={handleBackToMain} />;
  }

  if (currentPage === 'interest') {
    return <InterestTrainingPage onBackToMain={handleBackToMain} />;
  }

  if (currentPage === 'life') {
    return <LifeSkillsPage onBackToMain={handleBackToMain} />;
  }

  if (currentPage === 'careerAdvance') {
    return <CareerAdvancePage onBackHome={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'senior') {
    return <SeniorEducationPage onBackHome={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'education') {
    return <EducationPromotionPage onBackHome={() => setCurrentPage('main')} />;
  }

  return (
    <MainPage 
      onLoginClick={handleGoToLogin}
      onLogout={handleLogout}
      isLoggedIn={isLoggedIn}
      userRole={userRole}
      onGoToSkillCertification={() => setCurrentPage('skill')}
      onGoToInterestTraining={() => setCurrentPage('interest')}
      onGoToLifeSkills={() => setCurrentPage('life')}
      onCareerAdvance={() => setCurrentPage('careerAdvance')}
      onGoToSeniorEducation={() => setCurrentPage('senior')}
      onGoToEducationPromotion={() => setCurrentPage('education')}
    />
  );
}

export default App;
