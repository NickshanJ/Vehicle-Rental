import React, { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVehicle(response.data);
      } catch (error) {
        setError('Error fetching vehicle details');
        console.error('Error fetching vehicle details:', error);
      }
    };

    fetchVehicle();
  }, [id]);

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition !== null) {
      window.scrollTo(0, parseFloat(savedScrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  const handleReviewClick = () => {
    navigate(`/review/${id}`);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!vehicle) {
    return <p className='flex items-center justify-center h-screen text-center text-orange-500 font-bold animate-bounce'>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        <img
          src={vehicle.images[0]}
          alt={vehicle.model}
          className="w-full lg:w-1/2 h-64 lg:h-auto object-cover rounded-md mb-4 lg:mb-0"
        />
        <div className="lg:ml-6 flex-grow">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold mb-4">{vehicle.model}</h2>
            <button
              className="mb-4 bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
          <p className="text-gray-700 mb-2">Make: {vehicle.make}</p>
          <p className="text-gray-700 mb-2">Year: {vehicle.year}</p>
          <p className="text-gray-700 mb-2">Price Per Day: Rs. {vehicle.pricePerDay.toLocaleString()}</p>
          <p className="text-gray-700 mb-2">Description: {vehicle.description}</p>
          <p className="text-gray-700 mb-2">Mileage: {vehicle.mileage} km</p>
          <p className="text-gray-700 mb-2">Weight: {vehicle.weight} kg</p>
          <p className="text-gray-700 mb-2">Top Speed: {vehicle.topSpeed} km/h</p>
          <p className="text-gray-700 mb-2">Fuel Type: {vehicle.fuelType}</p>
          <p className="text-gray-700 mb-2">Location: {vehicle.location}</p>
          <p className="text-gray-700 mb-2">Availability: {vehicle.availability ? 'Available' : 'Not Available'}</p>
          <div className="flex space-x-4">
            <button
              className="bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleBookNow}
            >
              Book Now
            </button>
            <button
              className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleReviewClick}
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;