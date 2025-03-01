import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSupportInquiries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('https://vehicle-rental-server.onrender.com/api/admin/queries', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQueries(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching queries:', err);

        if (err.response && err.response.status === 403) {
          setError('Access denied. Admin privileges are required.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (err.response && err.response.status === 404) {
          setError('Endpoint not found. Please check the URL.');
        } else {
          setError('Failed to load queries. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleReplySubmit = async (e, queryId) => {
    e.preventDefault();
    const reply = e.target.reply.value;

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `https://vehicle-rental-server.onrender.com/api/admin/queries/${queryId}/reply`,
        { reply },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedQueries = queries.map((q) => (q.id === queryId ? response.data : q));
      setQueries(updatedQueries);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading queries...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Support Inquiries</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queries.length > 0 ? (
          queries.map((query) => (
            <div key={query.id} className="p-4 bg-gray-100 shadow rounded">
              <p><span className="font-bold">User:</span> {query.user}</p>
              <p><span className="font-bold">Query:</span> {query.query}</p>
              <p><span className="font-bold">Reply:</span> {query.reply ? query.reply : 'No reply yet'}</p>
              <form onSubmit={(e) => handleReplySubmit(e, query.id)}>
                <textarea
                  name="reply"
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="Type your reply here..."
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Submit Reply
                </button>
              </form>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No support inquiries found.</p>
        )}
      </div>
    </div>
  );
};

export default UserSupportInquiries;
