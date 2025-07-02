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
        element={<MainPage />} 
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
      
      {/* 旧路径重定向到新路径 */}
      <Route path="/life-skills" element={<Navigate to="/category/1" replace />} />
      <Route path="/career-advance" element={<Navigate to="/category/3" replace />} />
      <Route path="/senior-education" element={<Navigate to="/category/2" replace />} />
      <Route path="/education-promotion" element={<Navigate to="/category/4" replace />} />
      <Route path="/interest-training" element={<Navigate to="/category/5" replace />} />
      <Route path="/skill-certification" element={<Navigate to="/category/6" replace />} />
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
