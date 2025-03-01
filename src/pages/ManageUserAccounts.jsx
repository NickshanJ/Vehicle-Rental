import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUserAccounts = () => {
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 

  // Fetch all user data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch a user's details, including bookings, payments, and reviews
  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data); 
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage User Accounts</h2>

      {/* List Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-blue-50"
            onClick={() => fetchUserDetails(user._id)} 
          >
            <h3 className="font-bold text-lg">{user.username}</h3>
            <p>Email: {user.email}</p>
            <p className="text-sm text-gray-600">Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>

      {/* User Details Section */}
      {selectedUser && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Details for {selectedUser.username}</h3>

          {/* Past Bookings */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Past Bookings</h4>
            <div className="space-y-4">
              {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                selectedUser.bookings.map((booking) => (
                  <div key={booking._id} className="p-4 bg-gray-100 shadow rounded">
                    <p><span className="font-bold">Vehicle:</span> {booking.vehicle.model}</p>
                    <p><span className="font-bold">Dates:</span> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p><span className="font-bold">Total:</span> ${booking.totalAmount}</p>
                  </div>
                ))
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Payment History</h4>
            <div className="space-y-4">
              {selectedUser.payments && selectedUser.payments.length > 0 ? (
                selectedUser.payments.map((payment) => (
                  <div key={payment._id} className="p-4 bg-gray-100 shadow rounded">
                    <p><span className="font-bold">Amount:</span> ${payment.amount}</p>
                    <p><span className="font-bold">Date:</span> {new Date(payment.date).toLocaleDateString()}</p>
                    <p><span className="font-bold">Status:</span> {payment.status}</p>
                  </div>
                ))
              ) : (
                <p>No payment history found.</p>
              )}
            </div>
          </div>

          {/* User Reviews */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Reviews</h4>
            <div className="space-y-4">
              {selectedUser.reviews && selectedUser.reviews.length > 0 ? (
                selectedUser.reviews.map((review) => (
                  <div key={review._id} className="p-4 bg-gray-100 shadow rounded">
                    <p><span className="font-bold">Vehicle:</span> {review.vehicle.model}</p>
                    <p><span className="font-bold">Rating:</span> {review.rating}</p>
                    <p><span className="font-bold">Comment:</span> {review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserAccounts;