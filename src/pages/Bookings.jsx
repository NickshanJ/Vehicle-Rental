import React from 'react';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';

const Bookings = () => {
  return (
    <div>
      <BookingForm />
      <BookingsList />
    </div>
  );
};

export default Bookings;
