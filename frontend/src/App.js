import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import AdminPage from './components/AdminPage';
import CategoryVideoPage from './components/CategoryVideoPage';
import PointsMall from './components/PointsMall';
import UserProfile from './components/UserProfile';
import ExpertProfile from './components/ExpertProfile';
import InstitutionProfile from './components/InstitutionProfile';
import UserOrders from './components/UserOrders';
import NewLogin from './components/NewLogin';
import ProjectViewer from './components/ProjectViewer';
import ProjectListPage from './components/ProjectListPage';
import MyCourses from './components/MyCourses';
import MyProjects from './components/MyProjects';
import InstitutionCourseManagement from './components/InstitutionCourseManagement';
import ActivityDetail from './components/ActivityDetail';
import About from './components/About';
import Contact from './components/Contact';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import InterestTrainingPage from './components/InterestTrainingPage';
import LifeSkillsPage from './components/LifeSkillsPage';
import CareerAdvancePage from './components/CareerAdvancePage';
import EducationPromotionPage from './components/EducationPromotionPage';
import ExpertCertificateReview from './components/ExpertCertificateReview';
import StudentCertificatePage from './components/StudentCertificateApply';
import CertificateApplicationView from './components/CertificateApplicationView';
import CourseViewer from './components/CourseViewer';

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

// A simple component to check for institution role
const InstitutionRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');
  return isAuthenticated && role === '2' ? children : <Navigate to="/login" replace />;
};

// A simple component to check for expert role
const ExpertRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');
  return isAuthenticated && role === '3' ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const navigate = useNavigate();

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
      <Route path="/category/:category" element={<CategoryVideoPage />} />
      <Route path="/new-login" element={<NewLogin />} />
      <Route path="/projects" element={<ProjectListPage />} />
      <Route path="/projects/:id" element={<ProjectViewer />} />
      <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
      <Route path="/my-projects" element={<PrivateRoute><MyProjects /></PrivateRoute>} />
      <Route 
        path="/institution/courses" 
        element={<InstitutionRoute><InstitutionCourseManagement /></InstitutionRoute>} 
      />
      <Route path="/activity/:id" element={<ActivityDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* 保留旧的路径并导向新的分类页面 */}
      <Route path="/skill-certification" element={<PrivateRoute><StudentCertificatePage /></PrivateRoute>} />
      <Route path="/interest-training" element={<InterestTrainingPage />} />
      <Route path="/life-skills" element={<LifeSkillsPage />} />
      <Route path="/career-advance" element={<CareerAdvancePage />} />
      <Route path="/education-promotion" element={<EducationPromotionPage />} />
      <Route
        path="/expert/certificate-review"
        element={<ExpertRoute><ExpertCertificateReview /></ExpertRoute>}
      />
      <Route
        path="/expert/application/:id"
        element={<ExpertRoute><CertificateApplicationView /></ExpertRoute>}
      />
      <Route path="/course/:id" element={<CourseViewer />} />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      const user = JSON.parse(userString);
      setIsLoggedIn(true);
      setRole(user.role);
    }
  }, []);

  // 用于需要登录才能访问的路由
  const ProtectedRoute = ({ element, requiredRole = null }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      return <Navigate to="/login" />;
    }

    if (requiredRole) {
      const user = JSON.parse(userString);
      if (user.role !== requiredRole) {
        return <Navigate to="/" />;
      }
    }

    return element;
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
