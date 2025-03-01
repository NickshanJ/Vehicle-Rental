import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ amount, vehicleId, startDate, endDate }) => {
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    try {
      const response = await axios.post('https://vehicle-rental-server.onrender.com/api/payment/create-checkout-session', {
        amount,
        vehicleId,
        startDate,
        endDate
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error during payment:', error);
      setMessage('Payment failed. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;