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
        console.log("Parsed User at AuthContext:", user); 
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: user
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;