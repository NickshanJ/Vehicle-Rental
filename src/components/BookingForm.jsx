import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://vehicle-rental-server.onrender.com';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({ startDate: '', endDate: '' });
  const [totalAmount, setTotalAmount] = useState(0);
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchVehicleDetails();
    fetchAvailability();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && vehicle) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const d = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      setDays(d);
      setTotalAmount(d * vehicle.pricePerDay);
    } else {
      setDays(0);
      setTotalAmount(0);
    }
  }, [formData, vehicle]);

  const fetchVehicleDetails = async () => {
    try {
      // FIX: was http://localhost:5000
      const response = await axios.get(`${BASE_URL}/api/vehicles/${id}`);
      setVehicle(response.data);
    } catch (error) {
      setError('Failed to load vehicle details');
    }
  };

  const fetchAvailability = async () => {
    try {
      // FIX: was http://localhost:5000
      const response = await axios.get(`${BASE_URL}/api/vehicles/${id}/availability`);
      setAvailability(response.data.availability || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) { setError('Start date cannot be in the past'); return; }
    if (end <= start) { setError('End date must be after start date'); return; }

    const conflict = availability.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return start < bookingEnd && end > bookingStart;
    });
    if (conflict) { setError('Vehicle is not available for the selected dates'); return; }

    setSubmitting(true);
    try {
      // FIX: use Stripe checkout session (not localhost, not direct booking)
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/payments/create-checkout-session`,
        { vehicle: id, startDate: formData.startDate, endDate: formData.endDate, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to proceed to payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-orange-500 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/vehicles')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl">
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition font-semibold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-8">
        Book <span className="text-orange-500">{vehicle?.make} {vehicle?.model}</span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT — Booking Form */}
        <div className="lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-5">Select Your Dates</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            {/* Price summary */}
            {totalAmount > 0 && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>₹{vehicle?.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-orange-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-orange-600 text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !formData.startDate || !formData.endDate}
              className={`w-full font-bold py-3 rounded-xl text-white transition text-base ${
                submitting || !formData.startDate || !formData.endDate
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : 'Proceed to Payment'}
            </button>
          </form>
        </div>

        {/* RIGHT — Vehicle Image (same size as VehicleDetails: w-full h-64 lg:h-full) */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            {/* FIX: image uses same dimensions as VehicleDetails page */}
            <img
              src={vehicle?.images?.[0] || '/placeholder-car.jpg'}
              alt={`${vehicle?.make} ${vehicle?.model}`}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900">{vehicle?.make} {vehicle?.model}</h3>
              <p className="text-gray-400 text-sm mb-2">{vehicle?.year} · {vehicle?.vehicleType}</p>
              <div className="flex items-baseline space-x-1 mb-3">
                <span className="text-orange-600 font-black text-xl">₹{vehicle?.pricePerDay?.toLocaleString()}</span>
                <span className="text-gray-400 text-xs">/day</span>
              </div>
              {vehicle?.location && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vehicle.location}</span>
                </div>
              )}
              {vehicle?.description && (
                <p className="text-gray-500 text-sm mt-3">{vehicle.description}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingForm;