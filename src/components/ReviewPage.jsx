import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        setError('Error fetching vehicle details');
        console.error('Error fetching vehicle details:', error);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://vehicle-rental-server.onrender.com/api/vehicles/${id}/reviews`,
        { review },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccess('Review submitted successfully!');
      setReview('');
    } catch (error) {
      setError('Error submitting review');
      console.error('Error submitting review:', error);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!vehicle) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Write a Review for {vehicle.model}</h2>
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        {/* Left Side: Vehicle Image */}
        <div className="lg:w-1/2">
          <img
            src={vehicle.images[0]}
            alt={vehicle.model}
            className="w-full h-64 lg:h-auto object-cover rounded-md"
          />
        </div>
        {/* Right Side: Review Form */}
        <div className="lg:ml-6 lg:w-1/2">
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Write your review here..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
          <button
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={() => navigate(-1)} 
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
