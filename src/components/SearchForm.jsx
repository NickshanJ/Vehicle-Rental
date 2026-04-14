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
      const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles');
      const filteredVehicles = response.data.filter(vehicle => {
        const matchesType = vehicleType ? vehicle.vehicleType === vehicleType : true;
        const matchesLocation = location ? vehicle.location === location : true;
        let matchesPrice = true;
        if (priceRange === 'low') matchesPrice = vehicle.pricePerDay <= 500;
        else if (priceRange === 'medium') matchesPrice = vehicle.pricePerDay > 500 && vehicle.pricePerDay <= 1500;
        else if (priceRange === 'high') matchesPrice = vehicle.pricePerDay > 1500;
        return matchesType && matchesLocation && matchesPrice;
      });
      navigate('/search-results', { state: { vehicles: filteredVehicles } });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const selectClass = "flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mt-8 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Find Your Vehicle</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select className={selectClass} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option value="">🚗 All Types</option>
          <option value="Scooter">🛵 Scooter</option>
          <option value="Bike">🏍️ Bike</option>
          <option value="Manual">🚙 Manual Car</option>
          <option value="Automatic">🚘 Automatic Car</option>
        </select>

        <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">📍 All Locations</option>
          <option value="Velachery">Velachery</option>
          <option value="Guindy">Guindy</option>
          <option value="OMR">OMR</option>
          <option value="Medavakkam">Medavakkam</option>
          <option value="Tambaram">Tambaram</option>
        </select>

        <select className={selectClass} value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">💰 All Prices</option>
          <option value="low">Under ₹500/day</option>
          <option value="medium">₹500–₹1500/day</option>
          <option value="high">Above ₹1500/day</option>
        </select>

        <button
          className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition whitespace-nowrap"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchForm;