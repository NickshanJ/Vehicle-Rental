import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPaymentAndCreateBooking = async () => {
      const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');

      if (!paymentIntentId) {
        navigate('/');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          'https://vehicle-rental-server.onrender.com/api/bookings/payment-confirmation',
          { paymentIntentId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Booking created:', response.data);
        navigate('/thank-you');
      } catch (error) {
        console.error('Error confirming payment and creating booking:', error);
        navigate('/checkout-cancelled');
      }
    };

    confirmPaymentAndCreateBooking();
  }, [navigate]);

  return (
    <div>
      <h2>Processing Payment...</h2>
    </div>
  );
};

export default PaymentHandler;