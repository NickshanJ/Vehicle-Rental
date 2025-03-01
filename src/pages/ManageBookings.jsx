import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token'); 

        // Make an API call to fetch bookings
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data); 
        setLoading(false); 
      } catch (err) {
        console.error('Error fetching bookings:', err);

        if (err.response && err.response.status === 403) {
          setError('Access denied. Admin privileges are required.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Failed to load bookings. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Display loading state
  if (loading) {
    return <div className="text-center font-bold animate-bounce mt-10">Loading bookings...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Render booking cards
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const { user, vehicle, startDate, endDate, totalAmount } = booking || {};

            return (
              <div key={booking._id} className="p-4 bg-gray-100 shadow rounded">
                <p><span className="font-bold">Booking ID:</span> {booking._id}</p>
                <p><span className="font-bold">User:</span> {user ? user.username : 'Unknown User'}</p>
                <p><span className="font-bold">Vehicle:</span> {vehicle ? vehicle.model : 'Unknown Vehicle'}</p>
                <p><span className="font-bold">Start Date:</span> {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-bold">End Date:</span> {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-bold">Total Amount:</span> ${totalAmount || '0'}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;