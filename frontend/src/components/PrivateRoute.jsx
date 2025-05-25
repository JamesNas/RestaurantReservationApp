// src/components/PrivateRoute.jsx
import React from 'react';
import useAuth from '../hooks/useAuth';  // ✅ Changed from { useAuth } to useAuth
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateRoute;