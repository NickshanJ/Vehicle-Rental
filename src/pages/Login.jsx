import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('https://vehicle-rental-server.onrender.com/api/auth/login', { username, password });

      // Debugging: Log the entire response object
      console.log("Server Response:", response);

      const user = response.data.user;

      // Debugging: Log the user object to ensure it contains isAdmin
      console.log("User Object at Login:", user);

      if (user && user.isAdmin !== undefined) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuth({ isAuthenticated: true, user: user });
        setMessage('Login successful');

        navigate('/');
      } else {
        console.error('User object does not contain isAdmin flag');
      }
    } catch (error) {
      console.log('Error Response:', error.response); // Log the entire error response
      setMessage(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-blue-500">Forgot your password?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            LOGIN
          </button>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;