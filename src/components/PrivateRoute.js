import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element: Component, requiredRole, ...rest }) => {
  const { currentUser } = useAuth();

  // Check if the user is authenticated and authorized
  if (!currentUser || currentUser.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  // Render the protected component
  return <Component {...rest} />;
};

export default PrivateRoute;
