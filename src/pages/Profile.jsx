import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://vehicle-rental-server.onrender.com';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch profile
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const p = res.data.profile;
      setProfile(p);
      setReviews(p.reviews || []);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile. Please try again.');
    }

    // Fetch bookings separately
    try {
      const bookingRes = await axios.get(`${BASE_URL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingRes.data || []);
    } catch (err) {
      console.error('Bookings fetch error:', err);
    }

    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('username', profile.username);
      formData.append('email', profile.email);
      if (image) formData.append('image', image);

      const res = await axios.put(`${BASE_URL}/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = res.data.user || res.data;
      setProfile(prev => ({ ...prev, ...updatedUser }));
      setMessage('Profile updated successfully!');
      setImage(null);
      setPreviewUrl(null);

      // Keep localStorage in sync so header avatar refreshes
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updatedUser }));

    } catch (err) {
      console.error('Update error:', err);
      setMessage('Update failed. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    const imgPath = profile?.profileImage || profile?.imageUrl;
    if (!imgPath) return null;
    return imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-orange-500 font-bold text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchAll}
          className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const displayImageUrl = getImageUrl();

  return (
    <div className="container mx-auto p-4 pb-16 relative">
      {/* Back Button */}
      <button
        className="absolute top-4 right-4 bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {/* PROFILE CARD */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="flex items-start space-x-6">

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-48 w-48 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-orange-200">
                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-6xl font-black text-orange-500 select-none">
                    {profile.username?.[0]?.toUpperCase() || <FontAwesomeIcon icon={faUser} />}
                  </span>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition shadow-lg">
                <FontAwesomeIcon icon={faUpload} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <div className="flex-grow">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Update Profile
                </button>
              </div>
            </form>
            {message && (
              <p className={`mt-3 font-semibold ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BOOKINGS & REVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Bookings */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">My Bookings</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500">No bookings yet.</p>
              <p className="text-gray-400 text-sm mt-1">Book a vehicle to see it here.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">
                        {booking.vehicle?.model || 'Vehicle'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 mt-1">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {booking.status || 'confirmed'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">My Reviews</h3>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">⭐</p>
              <p className="text-gray-500">No reviews yet.</p>
              <p className="text-gray-400 text-sm mt-1">Reviews appear here after you submit them.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-800">{review.vehicle?.model || 'Vehicle'}</p>
                    <span className="text-yellow-400 text-sm">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;