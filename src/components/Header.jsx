import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = 'https://vehicle-rental-server.onrender.com';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <li>
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
          isActive(to)
            ? 'bg-orange-500 text-white'
            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        {label}
      </Link>
    </li>
  );

  const profileImageUrl = auth.user?.profileImage
    ? `${BASE_URL}${auth.user.profileImage}`
    : null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">VR</span>
          </div>
          <span className="text-orange-500 text-xl font-black tracking-tight">VehicleRental</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-1">
          {!auth.isAuthenticated ? (
            <>
              <li>
                <Link to="/login" className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg text-sm hover:bg-orange-600 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="px-4 py-2 border border-orange-500 text-orange-500 font-semibold rounded-lg text-sm hover:bg-orange-50 transition">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              {navLink('/vehicles', 'Vehicles')}
              {auth.user?.isAdmin ? (
                navLink('/admin', 'Admin Dashboard')
              ) : (
                <>
                  {navLink('/profile', 'Profile')}
                  {navLink('/support', 'Support')}
                </>
              )}
              <li>
                <Link
                  to="/logout"
                  className="px-3 py-2 rounded-lg font-semibold text-sm text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </Link>
              </li>
              {/* Avatar */}
              <li>
                <Link to="/profile">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-orange-400 hover:border-orange-600 transition"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-orange-600 font-bold text-sm">
                      {auth.user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <ul className="flex flex-col space-y-1 mt-2">
            {!auth.isAuthenticated ? (
              <>
                {navLink('/login', 'Login')}
                {navLink('/register', 'Sign Up')}
              </>
            ) : (
              <>
                {navLink('/vehicles', 'Vehicles')}
                {auth.user?.isAdmin ? navLink('/admin', 'Admin Dashboard') : (
                  <>
                    {navLink('/profile', 'Profile')}
                    {navLink('/support', 'Support')}
                  </>
                )}
                <li>
                  <Link to="/logout" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg font-semibold text-sm text-red-500 hover:bg-red-50">
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;