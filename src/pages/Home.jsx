import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        const bikes = data.filter(v => v.vehicleType === 'Bike' || v.vehicleType === 'Scooter');
        const cars = data.filter(v => v.vehicleType === 'Manual' || v.vehicleType === 'Automatic');
        setRandomBikes(bikes.sort(() => 0.5 - Math.random()).slice(0, 4));
        setRandomCars(cars.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const handleCardClick = (id) => {
    if (!auth.isAuthenticated) { navigate('/login'); return; }
    navigate(`/vehicles/${id}`);
  };

  const VehicleCard = ({ vehicle }) => (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      onClick={() => handleCardClick(vehicle._id)}
    >
      <div className="relative">
        <img src={vehicle.images?.[0]} alt={vehicle.model} className="w-full h-48 object-cover" />
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
          vehicle.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {vehicle.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{vehicle.model}</h3>
        <p className="text-xs text-gray-400 mb-2">{vehicle.make}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-orange-600 font-black text-lg">₹{vehicle.pricePerDay}</span>
          <span className="text-gray-400 text-xs">/day</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Chennai's #1 Vehicle Rental
          </span>
          <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
            Rent Any Vehicle,<br /><span className="text-orange-500">Anywhere in Chennai</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Bikes, scooters, manual and automatic cars — available across Velachery, OMR, Guindy and more.
          </p>
          {!auth.isAuthenticated && (
            <div className="flex justify-center gap-4">
              <Link to="/register" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition text-base">
                Get Started
              </Link>
              <Link to="/login" className="border border-orange-500 text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition text-base">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4">
        <SearchForm setVehicles={setVehicles} vehicles={vehicles} />
      </div>

      {/* Features row */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: 'Instant Booking', desc: 'Book in under 2 minutes' },
            { icon: '📍', title: '5 Locations', desc: 'Across Chennai city' },
            { icon: '🛡️', title: 'Fully Insured', desc: 'All vehicles covered' },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h4 className="font-bold text-gray-900">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bikes section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">🏍️ Bikes & Scooters</h2>
            <p className="text-gray-400 text-sm">Quick, affordable two-wheelers</p>
          </div>
          <button onClick={() => auth.isAuthenticated ? navigate('/vehicles') : navigate('/login')}
            className="text-sm text-orange-500 font-bold hover:underline">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomBikes.length > 0
            ? randomBikes.map(bike => <VehicleCard key={bike._id} vehicle={bike} />)
            : Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-60 animate-pulse" />
            ))
          }
        </div>
      </div>

      {/* Cars section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">🚗 Cars</h2>
            <p className="text-gray-400 text-sm">Manual and automatic options</p>
          </div>
          <button onClick={() => auth.isAuthenticated ? navigate('/vehicles') : navigate('/login')}
            className="text-sm text-orange-500 font-bold hover:underline">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomCars.length > 0
            ? randomCars.map(car => <VehicleCard key={car._id} vehicle={car} />)
            : Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-60 animate-pulse" />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Home;