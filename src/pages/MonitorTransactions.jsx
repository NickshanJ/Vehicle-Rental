import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonitorTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/payment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        if (err.response && err.response.status === 403) {
          setError('Access denied. Admin privileges are required.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (err.response && err.response.status === 404) {
          setError('Endpoint not found. Please check the URL.');
        } else {
          setError('Failed to load payments. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="text-center font-bold animate-bounce mt-10">Loading payments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Monitor Completed Transactions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment._id} className="p-4 bg-gray-100 shadow rounded">
              <p><span className="font-bold">Payment ID:</span> {payment._id}</p>
              <p><span className="font-bold">User:</span> {payment.user ? payment.user.username : 'Unknown User'}</p>
              <p><span className="font-bold">Amount:</span> ${payment.amount}</p>
              <p><span className="font-bold">Date:</span> {new Date(payment.date).toLocaleDateString()}</p>
              <p><span className="font-bold">Status:</span> {payment.status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No completed payments found.</p>
        )}
      </div>
    </div>
  );
};

export default MonitorTransactions;