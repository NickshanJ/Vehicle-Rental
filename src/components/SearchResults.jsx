import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicles = location.state?.vehicles || [];

  const handleClick = (id) => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
    navigate(`/vehicles/${id}`); // Navigate to vehicle details
  };

  const handleBackToHome = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Search Results</h2>
        {/* Back to Home Button */}
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={handleBackToHome} // Back to Home handler
        >
          Back to Home
        </button>
      </div>
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-left w-full"
              onClick={() => handleClick(vehicle._id)}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.model}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
              <p className="text-gray-700">Rs. {vehicle.pricePerDay.toLocaleString()} /day</p>
            </button>
          ))}
        </div>
      ) : (
        <p>No vehicles found</p>
      )}
    </div>
  );
};

export default SearchResults;