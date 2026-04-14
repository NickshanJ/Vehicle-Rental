import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles');
        setVehicles(response.data);
      } catch (err) {
        setError('Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-orange-500 text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-semibold">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900">All Vehicles</h2>
          <p className="text-gray-500 mt-1">{vehicles.length} vehicles available</p>
        </div>
        <button
          className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition flex items-center space-x-2"
          onClick={() => navigate('/')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">{error}</div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate(`/vehicles/${vehicle._id}`)}
            >
              <div className="relative">
                <img
                  src={vehicle.images?.[0]}
                  alt={vehicle.model}
                  className="w-full h-48 object-cover"
                />
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                  vehicle.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {vehicle.availability ? 'Available' : 'Unavailable'}
                </span>
                {vehicle.vehicleType && (
                  <span className="absolute top-3 left-3 bg-white/90 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {vehicle.vehicleType}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-1">{vehicle.model}</h3>
                <p className="text-xs text-gray-400 mb-2">{vehicle.make} · {vehicle.year}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 font-black text-lg">₹{vehicle.pricePerDay.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs">/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🚗</p>
          <p className="text-gray-500 font-semibold">No vehicles found. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;