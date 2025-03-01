import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const filteredVehicles = response.data.filter(vehicle => {
        let matchesVehicleType = vehicleType ? vehicle.vehicleType === vehicleType : true;
        let matchesLocation = location ? vehicle.location === location : true;
        let matchesPriceRange = true;

        if (priceRange === 'low') {
          matchesPriceRange = vehicle.pricePerDay > 300;
        } else if (priceRange === 'medium') {
          matchesPriceRange = vehicle.pricePerDay >= 1000 && vehicle.pricePerDay <= 2000;
        } else if (priceRange === 'high') {
          matchesPriceRange = vehicle.pricePerDay > 2000;
        }

        return matchesVehicleType && matchesLocation && matchesPriceRange;
      });

      navigate('/search-results', { state: { vehicles: filteredVehicles } });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  return (
      <div className="bg-white p-6 rounded-[100px] shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 mb-40">
        <select
          className="p-3 border rounded-[100px] bg-gray-50 focus:outline-none focus:ring focus:ring-orange-500"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Scooter">Scooter</option>
          <option value="Bike">Bike</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
        <select
          className="p-3 border rounded-[100px] bg-gray-50 focus:outline-none focus:ring focus:ring-orange-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="Velachery">Velachery</option>
          <option value="Guindy">Guindy</option>
          <option value="OMR">OMR</option>
          <option value="Medavakkam">Medavakkam</option>
          <option value="Tambaram">Tambaram</option>
        </select>
        <select
          className="p-3 border rounded-[100px] bg-gray-50 focus:outline-none focus:ring focus:ring-orange-500"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">All Price Ranges</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          className="bg-orange-600 text-white px-6 py-3 rounded-[100px] hover:bg-orange-700 transition duration-200 focus:ring focus:ring-orange-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
  );
};

export default SearchForm;