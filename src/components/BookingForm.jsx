import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('User is not authenticated');
      return;
    }

    try {
      const response = await axios.post(
        'https://vehicle-rental-server.onrender.com/api/bookings',
        {
          vehicle: vehicleId,
          startDate,
          endDate,
          totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
      // Reset form fields
      setVehicleId('');
      setStartDate('');
      setEndDate('');
      setTotalAmount('');
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Booking failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Book a Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehicle:</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Amount:</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;