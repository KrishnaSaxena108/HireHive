import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Not authenticated - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    } else if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authorized
  return element;
};

export default ProtectedRoute;
