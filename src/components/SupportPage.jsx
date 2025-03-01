import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupportPage = () => {
  const [query, setQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock sending the query to the backend
      console.log('Query sent:', query);
      setSuccess('Your message has been sent successfully!');
      setQuery('');
      setError('');
    } catch (err) {
      setError('Error sending message. Please try again later.');
      setSuccess('');
    }
  };

  // Handle Back button click
  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-orange-500">Support Center</h1>
        {/* Back Button */}
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col lg:flex-row">
        {/* Left Side: Information Section */}
        <div className="lg:w-1/2 pr-4 mb-6 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start mb-4 space-x-48">
            {/* Message Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H8l-4 4v-4H4a2 2 0 01-2-2V5z" />
            </svg>

            {/* Headset Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-orange-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12v4a5 5 0 005 5h1a1 1 0 001-1v-5a1 1 0 00-1-1H7v-3a5 5 0 1110 0v3h-1a1 1 0 00-1 1v5a1 1 0 001 1h1a5 5 0 005-5v-4c0-5.523-4.477-10-10-10z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Need Help? We're Here!</h2>
          <p className="text-gray-600">
            If you have any questions, issues, or queries, feel free to reach out to us. Our support team will get back to you as soon as possible!
          </p>
        </div>

        {/* Right Side: Form Section */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit}>
            {success && <p className="text-green-500 mb-4">{success}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows="6"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Describe your issue or query here..."
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Submit Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;