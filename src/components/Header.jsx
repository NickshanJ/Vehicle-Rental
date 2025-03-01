import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { auth } = useContext(AuthContext);

  console.log("Header - auth:", auth);

  return (
    <nav className="bg-white shadow-xl p-4 flex justify-between items-center">
      <div className="text-orange-500 text-xl font-bold">
        <Link to="/">Vehicle Rental</Link>
      </div>
      <ul className="flex space-x-4">
        {!auth.isAuthenticated ? (
          <>
            <li>
              <Link to="/login" className="font-bold bg-orange-500 rounded text-white hover:bg-white hover:text-orange-500 p-2">Login</Link>
            </li>
            <li>
              <Link to="/register" className="text-black font-bold hover:bg-orange-500 rounded hover:text-white p-2">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/vehicles" className="text-black font-bold hover:bg-orange-500 rounded hover:text-white p-2">Vehicles</Link>
            </li>
            {auth.user && auth.user.isAdmin ? (
              <li>
                <Link to="/admin" className="text-orange-500 font-bold rounded hover:bg-orange-500 hover:text-white p-2">Admin Dashboard</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="text-orange-500 font-bold rounded hover:bg-orange-500 hover:text-white p-2">Profile</Link>
                </li>
                <li>
                  <Link to="/support" className="text-orange-500 font-bold rounded hover:bg-orange-500 hover:text-white p-2">Support</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/logout" className="text-black font-bold hover:bg-orange-500 rounded hover:text-white p-2">Logout</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;