import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [randomBikes, setRandomBikes] = useState([]);
  const [randomCars, setRandomCars] = useState([]);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicles = async () => { 
      try {
        const response = await fetch('https://vehicle-rental-server.onrender.com/api/vehicles');
        const data = await response.json();

        const bikes = data.filter(
          (v) => v.vehicleType === 'Bike' || v.vehicleType === 'Scooter'
        );
        const cars = data.filter(
          (v) => v.vehicleType === 'Manual' || v.vehicleType === 'Automatic'
        );

        setRandomBikes(bikes.sort(() => 0.5 - Math.random()).slice(0, 4));
        setRandomCars(cars.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleCardClick = (id) => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/vehicles/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-orange-500 mt-20 font-bold mb-6">
        Welcome to Our Vehicle Rental Service
      </h1>

      <SearchForm setVehicles={setVehicles} vehicles={vehicles} />

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