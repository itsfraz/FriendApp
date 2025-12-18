import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

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
        `${API_URL}/search-users?query=${query}&userId=${userId}`,
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
        `${API_URL}/send-friend-request`,
        { fromUserId, toUserId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert('Friend request sent successfully!');
        // Update the user's status in the results list instead of removing them
        setResults((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, requestStatus: 'sent' } : user
          )
        );
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
    <div className="w-full relative">
      <div className="flex flex-row gap-2">
        <div className="relative flex-1">
             <input
               type="text"
               placeholder="Search..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
               className="w-full pl-8 md:pl-10 pr-4 py-1.5 md:py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-gray-100 text-gray-800"
             />
             <span className="absolute left-2.5 top-2 md:top-2.5 text-xs md:text-base text-gray-500">🔍</span>
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-blue-700 transition text-xs md:text-sm font-medium"
          disabled={loading}
        >
          {loading ? '...' : <span className="md:inline">Search</span>}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs absolute top-full mt-1 bg-white p-1 rounded shadow">{error}</p>}

      {results.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
             <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Results</span>
                <button onClick={() => setResults([])} className="text-xs text-red-500 hover:text-red-700">Close</button>
             </div>
             <ul className="divide-y divide-gray-100">
                {results.map((user) => (
                  <li key={user._id} className="flex justify-between items-center p-3 hover:bg-gray-50 transition">
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture ? `${API_URL}/${user.profilePicture}` : "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                         if (user.requestStatus === 'none') {
                            handleAddFriend(user._id);
                         }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        user.requestStatus === 'sent'
                          ? 'bg-gray-100 text-gray-500'
                          : user.requestStatus === 'received'
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      disabled={user.requestStatus === 'sent'}
                    >
                      {user.requestStatus === 'sent' ? 'Sent' : user.requestStatus === 'received' ? 'Received' : 'Add'}
                    </button>
                  </li>
                ))}
             </ul>
          </div>
      )}
    </div>
  );
}

export default SearchUsers;