import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewModal from './ReviewModal';

const ReviewPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasBooked, setHasBooked] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`https://vehicle-rental-server.onrender.com/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch {
        setError('Error fetching vehicle details');
      }
    };

    const checkBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://vehicle-rental-server.onrender.com/api/bookings/my-bookings',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const booked = response.data.some(
          (b) => b.vehicle?._id === id || b.vehicle === id
        );
        setHasBooked(booked);
      } catch {
        setHasBooked(false);
      }
    };

    fetchVehicle();
    checkBooking();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasBooked) { setError('You must book this vehicle before reviewing.'); return; }
    try {
      await axios.post(
        'https://vehicle-rental-server.onrender.com/api/reviews',
        { vehicle: id, rating, comment: review },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess(true);
      setReview('');
      setRating(5);
    } catch {
      setError('Error submitting review. Please try again.');
    }
  };

  if (!vehicle || hasBooked === null) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition font-semibold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-8">
        Review <span className="text-orange-500">{vehicle.model}</span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="lg:w-2/5">
          <img src={vehicle.images?.[0]} alt={vehicle.model} className="w-full h-full object-cover min-h-64" />
        </div>

        <div className="lg:w-3/5 p-6">
          {!hasBooked ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Required</h3>
              <p className="text-gray-500 mb-6 text-sm">
                You can only review a vehicle after you have booked it. Book this vehicle first, then come back to share your experience!
              </p>
              <button
                onClick={() => navigate(`/book/${id}`)}
                className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition"
              >
                Book Now
              </button>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Star rating */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][rating]}
                  </p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="5"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    placeholder="Share your experience with this vehicle..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
                >
                  Submit Review
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <ReviewModal isOpen={success} onClose={() => { setSuccess(false); navigate(-1); }} message="Review submitted successfully!" />
    </div>
  );
};

export default ReviewPage;