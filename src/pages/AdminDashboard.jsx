import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate(); 
  const [bookings, setBookings] = useState([]);

  const createBooking = async (newBooking) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://vehicle-rental-server.onrender.com/api/bookings', newBooking, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings([...bookings, response.data]);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
          <nav className="space-y-4">
            <Link
              to="vehicle-listings"
              className="block py-2 px-4 rounded-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300"
            >
              Manage Vehicle Listings
            </Link>
            <Link
              to="user-accounts"
              className="block py-2 px-4 rounded-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300"
            >
              Manage User Accounts
            </Link>
            <Link
              to="bookings"
              className="block py-2 px-4 rounded-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300"
            >
              Manage Bookings
            </Link>
            <Link
              to="transactions"
              className="block py-2 px-4 rounded-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300"
            >
              Monitor Transactions
            </Link>
            <Link
              to="support"
              className="block py-2 px-4 rounded-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300"
            >
              User Support Inquiries
            </Link>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="w-3/4 p-8">
        <div className="bg-white p-6 shadow-md rounded-lg relative">
          <button
            className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 font-bold rounded hover:bg-orange-600 transition duration-300"
            onClick={handleBack}
          >
            Back to Home
          </button>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;