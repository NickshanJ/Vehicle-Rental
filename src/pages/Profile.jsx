import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token); // Log token for debugging
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Profile data fetched:', response.data);

        if (response.data) {
          setProfile(response.data.profile);
          setBookings(response.data.profile.bookings); 
          setReviews(response.data.profile.reviews);

          if (response.data.profile.imageUrl) {
            setImageUrl(`https://vehicle-rental-server.onrender.com/${response.data.profile.imageUrl}`);
          }
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', profile.username);
      formData.append('email', profile.email);
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('https://vehicle-rental-server.onrender.com/api/auth/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(response.data);
      setMessage('Profile updated successfully');

      if (response.data.imageUrl) {
        setImageUrl(`https://vehicle-rental-server.onrender.com/${response.data.imageUrl}`);
      }
    } catch (error) {
      setMessage('Profile update failed');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleBack = () => {
    navigate(-1); 
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-center text-orange-500 font-bold animate-bounce">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      {/* Back Button */}
      <button
        className="absolute top-4 right-4 bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600"
        onClick={handleBack}
      >
        Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 text-5xl" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer">
                <FontAwesomeIcon icon={faUpload} className="text-white" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="opacity-0 absolute inset-0 cursor-pointer" />
              </label>
            </div>
          </div>
          <div className="flex-grow">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">Username:</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="text-right">
                <button type="submit" className="bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600">Update Profile</button>
              </div>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
          </div>
        </div>
      </div>

      {/* Current and Past Bookings and Reviews in Columns */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Current and Past Bookings */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Current and Past Bookings</h3>
          <ul className="list-disc pl-5">
            {bookings.map((booking) => (
              <li key={booking._id} className="mb-2">
                <p className="text-gray-700">
                  Vehicle Model: <span className="font-medium">{booking.vehicle?.model || 'N/A'}</span>
                </p>
                <p className="text-gray-700">
                  Start Date: <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</span>
                </p>
                <p className="text-gray-700">
                  End Date: <span className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</span>
                </p>
                <p className="text-gray-700">
                  Total Amount: <span className="font-medium">{booking.totalAmount}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Reviews</h3>
          <ul className="list-disc pl-5">
            {reviews.map((review) => (
              <li key={review._id} className="mb-2">
                <p className="text-gray-700">
                  Vehicle Model: <span className="font-medium">{review.vehicle?.model || 'N/A'}</span>
                </p>
                <p className="text-gray-700">
                  Rating: <span className="font-medium">{review.rating}</span>
                </p>
                <p className="text-gray-700">
                  Comment: <span className="font-medium">{review.comment}</span>
                </p>
                <p className="text-gray-700">
                  Date: <span className="font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;