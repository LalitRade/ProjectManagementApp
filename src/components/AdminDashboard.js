import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');  // Redirect to ProjectManagementApp
    }, 3000);  // Delay of 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>You will be redirected to the Project Management App shortly...</p>
    </div>
  );
};

export default AdminDashboard;
