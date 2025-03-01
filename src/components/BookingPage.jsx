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
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        setError(`Error fetching vehicle details: ${error.response?.data?.message || error.message}`);
      }
    };

    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}/availability`);
        setAvailability(response.data.availability);
      } catch (error) {
        setError(`Error fetching availability: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchVehicleDetails();
    fetchAvailability();
  }, [id]);

  // Calculate total price
  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))); // Ensure at least 1 day
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

  // Handle booking and redirect to Stripe Checkout
  const handleBookNow = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }

    setError(''); 
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://vehicle-rental-server.onrender.com/api/payment/create-checkout-session',
        {
          vehicle: id,
          startDate,
          endDate,
          totalAmount: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Stripe Checkout URL:', response.data.url); 

      // Redirect to Stripe Checkout page
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Booking error:', error.message || error.response?.data?.error);
      setError('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  // Render error message
  if (error) {
    return <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>;
  }

  // Render loading state
  if (!vehicle) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex items-center justify-between'>
      <h2 className="text-3xl font-bold mb-8">Book {vehicle.model}</h2>
      <button
        className="mb-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-start bg-white p-6 rounded-lg shadow-md">
        {/* Left Side: Booking Form and Details */}
        <div className="lg:w-1/2 lg:mr-6">
          <p className="text-gray-600 mb-2">Price per day: ₹{vehicle.pricePerDay}</p>
          <p className="text-gray-600 mb-6">{vehicle.description}</p>
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
            className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ${
              !startDate || !endDate ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleBookNow}
            disabled={!startDate || !endDate || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </button>
        </div>

        {/* Right Side: Vehicle Image */}
        <div className="lg:w-1/2">
          <img
            src={vehicle.images[0]}
            alt={vehicle.model}
            className="w-full h-64 lg:h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;