import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/login';
import AdminDashboard from './components/AdminDashboard';
import ViewerDashboard from './components/ViewerDashboard';
import ProjectManagementApp from './ProjectManagementApp';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Private Routes with role-based protection */}
          <Route 
            path="/admin" 
            element={<PrivateRoute element={AdminDashboard} requiredRole="admin" />} 
          />
          <Route 
            path="/viewer" 
            element={<PrivateRoute element={ViewerDashboard} requiredRole="viewer" />} 
          />
          <Route 
            path="/" 
            element={<PrivateRoute element={ProjectManagementApp} requiredRole="admin" />} 
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
