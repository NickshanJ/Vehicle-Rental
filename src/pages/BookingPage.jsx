import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null); 
  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null); 
  const [availability, setAvailability] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [error, setError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 

  // Fetch vehicle details and availability
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        console.log(`Fetching vehicle details for ID: ${id}`);
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`);
        console.log('Vehicle details response:', response.data);
        setVehicle(response.data.vehicle);
      } catch (error) {
        setError(`Error fetching vehicle details: ${error.response?.data?.message || error.message}`);
        console.error('Vehicle fetch error:', error);
      }
    };

    const fetchAvailability = async () => {
      try {
        console.log(`Fetching availability for vehicle ID: ${id}`);
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}/availability`);
        console.log('Availability response:', response.data);
        setAvailability(response.data.availability);
      } catch (error) {
        setError(`Error fetching availability: ${error.response?.data?.message || error.message}`);
        console.error('Availability fetch error:', error);
      }
    };

    fetchVehicleDetails();
    fetchAvailability();
  }, [id]);

  // Handle the total price calculation
  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))); 
      setTotalPrice(days * vehicle.pricePerDay);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, vehicle]);

  // Check if a date is available
  const isDateAvailable = (date) => {
    return !availability.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date <= end;
    });
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://vehicle-rental-server.onrender.com/api/bookings',
        {
          vehicle: id,
          startDate,
          endDate,
          totalAmount: totalPrice
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Booking successful!');
      navigate('/my-bookings'); 
    } catch (error) {
      setError('Booking failed: ' + (error.response?.data.message || 'Server error'));
      console.error('Booking error:', error);
    }
  };

  if (error) {
    return <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>;
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Book {vehicle.model}</h2>
      <img
        src={vehicle.images[0]}
        alt={vehicle.model}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="text-gray-600 mb-2">Price per day: ₹{vehicle.pricePerDay}</p>
      <p className="text-gray-600 mb-6">{vehicle.description}</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            filterDate={isDateAvailable} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate} 
            filterDate={isDateAvailable} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <p className="text-gray-800 font-bold mb-4">Total Price: ₹{totalPrice}</p>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            !startDate || !endDate ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleBookNow}
          disabled={!startDate || !endDate}
        >
          Book Now
        </button>
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default BookingPage;