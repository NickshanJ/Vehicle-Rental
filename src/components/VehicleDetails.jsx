import React, { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');
  const [hasBooked, setHasBooked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVehicle(response.data);
      } catch (error) {
        setError('Error fetching vehicle details');
      }
    };

    // Check if current user has a booking for this vehicle
    const checkBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://vehicle-rental-server.onrender.com/api/bookings/my-bookings',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const booked = response.data.some(
          (b) => b.vehicle?._id === id || b.vehicle === id
        );
        setHasBooked(booked);
      } catch {
        setHasBooked(false);
      }
    };

    fetchVehicle();
    checkBooking();
  }, [id]);

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition !== null) {
      window.scrollTo(0, parseFloat(savedScrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  if (error) return <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>;
  if (!vehicle) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-orange-500 text-center">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-semibold">Loading...</p>
      </div>
    </div>
  );

  const stats = [
    { label: 'Mileage', value: vehicle.mileage ? `${vehicle.mileage} km` : '—' },
    { label: 'Top Speed', value: vehicle.topSpeed ? `${vehicle.topSpeed} km/h` : '—' },
    { label: 'Weight', value: vehicle.weight ? `${vehicle.weight} kg` : '—' },
    { label: 'Fuel Type', value: vehicle.fuelType || '—' },
    { label: 'Year', value: vehicle.year || '—' },
    { label: 'Location', value: vehicle.location || '—' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-1/2 relative">
            <img
              src={vehicle.images?.[0]}
              alt={vehicle.model}
              className="w-full h-72 lg:h-full object-cover"
            />
            <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full shadow ${
              vehicle.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {vehicle.availability ? '✓ Available' : '✗ Unavailable'}
            </span>
            {vehicle.vehicleType && (
              <span className="absolute top-4 right-4 bg-white text-orange-600 text-sm font-bold px-3 py-1.5 rounded-full shadow">
                {vehicle.vehicleType}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 p-6 lg:p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-1">{vehicle.model}</h2>
            <p className="text-gray-400 text-sm mb-4">{vehicle.make}</p>

            <div className="flex items-baseline space-x-1 mb-4">
              <span className="text-4xl font-black text-orange-500">₹{vehicle.pricePerDay.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">/day</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{vehicle.description}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                className="flex-1 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigate(`/book/${id}`)}
                disabled={!vehicle.availability}
              >
                {vehicle.availability ? 'Book Now' : 'Not Available'}
              </button>

              {/* Review button — only if user has booked this vehicle */}
              <div className="relative group flex-1">
                <button
                  className={`w-full font-bold px-6 py-3 rounded-xl transition ${
                    hasBooked
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => hasBooked && navigate(`/review/${id}`)}
                  disabled={!hasBooked}
                >
                  Write a Review
                </button>
                {!hasBooked && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                    You must book this vehicle first to write a review
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;