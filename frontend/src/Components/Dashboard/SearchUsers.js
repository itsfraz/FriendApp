import React, { useState } from 'react';
import axios from 'axios';

function SearchUsers({ setRequestSent }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }

    setLoading(true);
    setError('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `http://localhost:5000/search-users?query=${query}&userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(response.data);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const fromUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!fromUserId || !token) {
        setError('User not authenticated. Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/send-friend-request',
        { fromUserId, toUserId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert('Friend request sent successfully!');
        setResults((prev) => prev.filter((user) => user._id !== userId)); // Remove the user from search results
        setRequestSent((prev) => !prev); // Update the pending friend requests list
      } else {
        alert(response.data.message); // Show error message from the backend
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      if (err.response) {
        alert(err.response.data.message); // Show error message from the backend
      } else {
        alert('Failed to send friend request. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Users</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <ul className="space-y-2">
        {results.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center">
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000/${user.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-600 text-sm">No Image</span>
                </div>
              )}
              <div>
                <p className="font-semibold">{user.name || user.username}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleAddFriend(user._id)}
              className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 text-sm"
            >
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchUsers;