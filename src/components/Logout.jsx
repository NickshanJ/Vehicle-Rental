import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logout = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false });
    navigate('/login');
  }, [navigate, setAuth]);

  return null;
};

export default Logout;