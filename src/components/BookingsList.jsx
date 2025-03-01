import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBookings(response.data);
      } catch (error) {
        setError('Error fetching bookings');
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://vehicle-rental-server.onrender.com/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      setError('Error deleting booking');
    }
  };

  return (
    <div>
      <h2>Bookings List</h2>
      {error && <p>{error}</p>}
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            Vehicle: {booking.vehicle.name}, Start Date: {booking.startDate}, End Date: {booking.endDate}, Status: {booking.status}
            <button onClick={() => handleDelete(booking._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsList;