import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;

    if (userString && userString !== 'undefined') {
      try {
        user = JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    if (token && user) {
      setAuth({ isAuthenticated: true, user });
    }
  }, []);

  const updateAuthUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setAuth(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;