import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://vehicle-rental-server.onrender.com';

const Profile = () => {
  const { auth } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ FIXED (use working endpoint)
      const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const p = res.data.profile; // ✅ IMPORTANT
      setProfile(p);

      setFormData({
        username: p.username,
        email: p.email,
        password: ''
      });

      setReviews(p.reviews || []);

    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    }

    try {
      const bookingRes = await axios.get(`${BASE_URL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingRes.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMsg('');

    try {
      const fd = new FormData();
      fd.append('username', formData.username);
      fd.append('email', formData.email);
      if (formData.password) fd.append('password', formData.password);
      if (image) fd.append('image', image);

      const res = await axios.put(`${BASE_URL}/api/users/profile`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updated = res.data.user || res.data;

      setProfile(prev => ({ ...prev, ...updated }));

      setSaveMsg('Profile updated successfully');
      setEditMode(false);
      setImage(null);
      setPreviewUrl(null);

    } catch (err) {
      console.error(err);
      setSaveMsg('Update failed');
    }
  };

  const profileImageUrl =
    previewUrl ||
    (profile?.imageUrl || profile?.profileImage
      ? `${BASE_URL}/${profile.imageUrl || profile.profileImage}`
      : null);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <div className="flex gap-6 items-center">

          <div>
            {profileImageUrl ? (
              <img src={profileImageUrl} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {profile.username?.[0]}
              </div>
            )}
          </div>

          <div className="flex-1">

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="username" value={formData.username} onChange={handleChange} className="border p-2 w-full" />
                <input name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
                <input name="password" value={formData.password} onChange={handleChange} placeholder="New password" className="border p-2 w-full" />

                <input type="file" onChange={handleImageChange} />

                <button className="bg-orange-500 text-white px-4 py-2 rounded">Save</button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold">{profile.username}</h2>
                <p>{profile.email}</p>

                <button onClick={() => setEditMode(true)} className="mt-2 text-orange-500">
                  Edit Profile
                </button>
              </>
            )}

            {saveMsg && <p className="mt-2">{saveMsg}</p>}
          </div>
        </div>
      </div>

      {/* BOOKINGS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-bold mb-3">Bookings</h3>
        {bookings.map(b => (
          <div key={b._id} className="mb-2">
            {b.vehicle?.model} - ₹{b.totalAmount}
          </div>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-3">Reviews</h3>
        {reviews.map(r => (
          <div key={r._id}>{r.comment}</div>
        ))}
      </div>

    </div>
  );
};

export default Profile;