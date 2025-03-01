import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles'); // Fetch vehicles from backend
        setVehicles(response.data);
      } catch (err) {
        console.error('Error fetching vehicles:', err.message);
        setError('Failed to fetch vehicles. Please try again later.');
      }
    };

    fetchVehicles();
  }, []);

  // Function to handle navigation to VehicleDetails
  const handleClick = (id) => {
    navigate(`/vehicles/${id}`);
  };

  // Function to navigate back to Home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Vehicle List</h2>
        {/* Back to Home Button */}
        <button
          className="bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white p-6 rounded-lg shadow-md text-left w-full transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => handleClick(vehicle._id)}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.model}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
              <p className="text-gray-700">
                Rs. {vehicle.pricePerDay.toLocaleString()} /day
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex items-center justify-center h-screen text-center text-orange-500 font-bold animate-bounce">
          No vehicles found. Please check back later!
        </p>
      )}
    </div>
  );
};

export default VehicleList;