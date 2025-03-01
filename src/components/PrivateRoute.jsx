import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const { auth } = useContext(AuthContext);
  const userRole = auth.user ? (auth.user.isAdmin ? 'admin' : 'user') : null;

  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - userRole:", userRole);

  if (!isAuthenticated) {
    console.log("PrivateRoute - Redirecting to /login");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;