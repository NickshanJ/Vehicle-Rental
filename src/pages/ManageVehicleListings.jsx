import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageVehicleListings = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: '',
    availability: true,
    location: '',
    description: '',
    mileage: '',
    weight: '',
    topSpeed: '',
    fuelType: '',
    images: null,
    vehicleType: '',
  }); // Form state
  const [editingId, setEditingId] = useState(null); 
  const [message, setMessage] = useState(''); 

  // Fetch all vehicle data from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/vehicles');
        setVehicles(response.data); 
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    fetchVehicles();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // Handle creating or updating vehicles
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images' && formData[key]) {
        Array.from(formData[key]).forEach((file) => data.append('images', file));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (editingId) {
      // Update existing vehicle
      try {
        const response = await axios.put(`https://vehicle-rental-server.onrender.com/api/vehicles/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setVehicles(vehicles.map((v) => (v._id === editingId ? response.data : v)));
        setMessage('Vehicle updated successfully');
        resetForm();
      } catch (error) {
        console.error('Error updating vehicle:', error);
        setMessage('Failed to update vehicle');
      }
    } else {
      // Create a new vehicle
      try {
        const response = await axios.post('https://vehicle-rental-server.onrender.com/api/vehicles', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setVehicles([...vehicles, response.data]);
        setMessage('Vehicle added successfully');
        resetForm();
      } catch (error) {
        console.error('Error adding vehicle:', error);
        setMessage('Failed to add vehicle');
      }
    }
  };

  // Reset form and editing state
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      make: '',
      model: '',
      year: '',
      pricePerDay: '',
      availability: true,
      location: '',
      description: '',
      mileage: '',
      weight: '',
      topSpeed: '',
      fuelType: '',
      images: null,
      vehicleType: '',
    });
  };

  // Handle deleting a vehicle
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`);
      setVehicles(vehicles.filter((v) => v._id !== id));
      setMessage('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setMessage('Failed to delete vehicle');
    }
  };

  // Handle editing a vehicle
  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      pricePerDay: vehicle.pricePerDay,
      availability: vehicle.availability,
      location: vehicle.location,
      description: vehicle.description,
      mileage: vehicle.mileage,
      weight: vehicle.weight,
      topSpeed: vehicle.topSpeed,
      fuelType: vehicle.fuelType,
      images: null, // Images cannot be pre-filled
      vehicleType: vehicle.vehicleType,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-orange-500 mb-4">Manage Vehicle Listings</h2>

      {/* Feedback message */}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* Vehicle Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Brand:</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Year:</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Price Per Day:</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Availability:</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Fuel Type:</label>
            <input
              type="text"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Images:</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-orange-600"
        >
          {editingId ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-red-500 text-white px-4 py-2 ml-4 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Vehicle Table */}
      <table className="table-auto w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Make</th>
            <th className="p-2 text-left">Model</th>
            <th className="p-2 text-left">Year</th>
            <th className="p-2 text-left">Price Per Day</th>
            <th className="p-2 text-left">Availability</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
        {vehicles.map((vehicle) => (
            <tr key={vehicle._id} className="border-t">
              <td className="p-2">{vehicle.make}</td>
              <td className="p-2">{vehicle.model}</td>
              <td className="p-2">{vehicle.year}</td>
              <td className="p-2">{vehicle.pricePerDay}</td>
              <td className="p-2">{vehicle.availability ? 'Available' : 'Unavailable'}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageVehicleListings;
