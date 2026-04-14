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
  const [days, setDays] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } catch { /* silent */ }
    };
    fetchVehicleDetails();
    fetchAvailability();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const d = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
      setDays(d);
      setTotalPrice(d * vehicle.pricePerDay);
    } else {
      setDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, vehicle]);

  const isDateAvailable = (date) => {
    return !availability.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date <= end;
    });
  };

  const handleBookNow = async () => {
    if (!startDate || !endDate) { setError('Please select start and end dates.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://vehicle-rental-server.onrender.com/api/payments/create-checkout-session',
        { vehicle: id, startDate, endDate, totalAmount: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url;
    } catch (error) {
      setError('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-orange-500 text-center">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition font-semibold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-8">Book <span className="text-orange-500">{vehicle.model}</span></h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — form */}
        <div className="lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-5">Select Your Dates</h3>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              filterDate={isDateAvailable}
              minDate={new Date()}
              placeholderText="Pick start date"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              filterDate={isDateAvailable}
              placeholderText="Pick end date"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Price summary */}
          {days > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>₹{vehicle.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-orange-200 pt-2 mt-2">
                <span>Total</span>
                <span className="text-orange-600 text-lg">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            className={`w-full font-bold py-3 rounded-xl text-white transition text-base ${
              !startDate || !endDate || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={handleBookNow}
            disabled={!startDate || !endDate || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing...</span>
              </span>
            ) : 'Proceed to Payment'}
          </button>
        </div>

        {/* Right — vehicle summary */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <img src={vehicle.images?.[0]} alt={vehicle.model} className="w-full h-56 object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900">{vehicle.model}</h3>
              <p className="text-gray-400 text-sm mb-3">{vehicle.make} · {vehicle.year}</p>
              <p className="text-gray-600 text-sm">{vehicle.description}</p>
              <div className="mt-4 flex items-center space-x-1">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-500">{vehicle.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;