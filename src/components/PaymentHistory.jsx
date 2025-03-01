import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
      } catch (error) {
        setError('Failed to load payment history: ' + error.message);
      }
    };

    fetchPayments();
  }, []);

  const generateInvoice = async (transactionId) => {
    try {
      const response = await axios.get(`/api/payments/invoice/${transactionId}`, {
        responseType: 'blob', 
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${transactionId}-invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Failed to generate invoice: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Payment History</h2>
      {error && <p className="text-red-500">{error}</p>}
      {payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Date</th>
              <th className="border border-gray-200 px-4 py-2">Amount</th>
              <th className="border border-gray-200 px-4 py-2">Transaction ID</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="border border-gray-200 px-4 py-2">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 px-4 py-2">₹{payment.amount}</td>
                <td className="border border-gray-200 px-4 py-2">{payment.transactionId}</td>
                <td className="border border-gray-200 px-4 py-2">{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <td className="border border-gray-200 px-4 py-2">
  <button
    onClick={() => generateInvoice(payment.transactionId)}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Download Invoice
  </button>
</td>

    </div>
  );
};

export default PaymentHistory;