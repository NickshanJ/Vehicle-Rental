import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchForm from '../components/SearchForm';

const Home = () => {
  const [vehicles, setVehicles] = useState([]); 
  const [randomBikes, setRandomBikes] = useState([]); 
  const [randomCars, setRandomCars] = useState([]); 
  const navigate = useNavigate(); 

  // Fetch and randomize bikes
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch('https://vehicle-rental-server.onrender.com/api/vehicles'); // API call to fetch all vehicles
        const data = await response.json();

        // Filter only bikes
        const bikes = data.filter(
          (vehicle) =>
            vehicle.vehicleType === 'Bike' || vehicle.vehicleType === 'Scooter'
        );

        // Select 4 random bikes
        const randomSelectedBikes = bikes.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRandomBikes(randomSelectedBikes);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };

    fetchBikes();
  }, []); 

  // Fetch and randomize cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://vehicle-rental-server.onrender.com/api/vehicles'); 
        const data = await response.json();

        // Filter only cars
        const cars = data.filter(
          (vehicle) =>
            vehicle.vehicleType === 'Manual' || vehicle.vehicleType === 'Automatic'
        );

        // Select 4 random cars
        const randomSelectedCars = cars.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRandomCars(randomSelectedCars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []); 

  // Navigate to VehicleDetails page
  const handleCardClick = (id) => {
    navigate(`/vehicles/${id}`); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-orange-500 mt-20 font-bold mb-6">
        Welcome to Our Vehicle Rental Service
      </h1>

      {/* Search Form */}
      <SearchForm setVehicles={setVehicles} vehicles={vehicles} />

      {/* Bikes Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Bikes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomBikes.map((bike) => (
            <div
              key={bike._id}
              className="bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(bike._id)}
            >
              <img
                src={bike.images[0]} 
                alt={bike.model}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{bike.model}</h3>
                <p className="text-gray-600">Price: ₹{bike.pricePerDay} / day</p>
                <p className="text-gray-500 text-sm mt-2">{bike.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cars Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Cars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomCars.map((car) => (
            <div
              key={car._id}
              className="bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(car._id)} 
            >
              <img
                src={car.images[0]} 
                alt={car.model}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{car.model}</h3>
                <p className="text-gray-600">Price: ₹{car.pricePerDay} / day</p>
                <p className="text-gray-500 text-sm mt-2">{car.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;