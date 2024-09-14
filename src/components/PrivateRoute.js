import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element: Element, requiredRole }) => {
  const { user } = useAuth();

  if (!user || !requiredRole.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Element />;
};

export default PrivateRoute;
