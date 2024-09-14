import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');  // Redirect to ProjectManagementApp
    }, 3000);  // Delay of 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Viewer Dashboard</h1>
      <p>You will be redirected to the Project Management App shortly...</p>
    </div>
  );
};

export default ViewerDashboard;
