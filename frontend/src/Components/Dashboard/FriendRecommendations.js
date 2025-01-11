import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';

const FriendRecommendations = memo(() => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('FriendRecommendations component rendered'); // Debugging: Check how many times the component renders

  useEffect(() => {
    console.log('useEffect triggered: Fetching friend recommendations'); // Debugging: Check when useEffect runs

    const fetchRecommendations = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('User ID:', userId); // Debugging: Check the user ID
      console.log('Token:', token); // Debugging: Check the token

      if (!userId || !token) {
        console.log('User not authenticated'); // Debugging: Check if authentication fails
        setError('User not authenticated. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching friend recommendations from the server...'); // Debugging: Check when the API call starts
        const response = await axios.get(
          `http://localhost:5000/friend-recommendations/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Friend recommendations fetched:', response.data); // Debugging: Check the fetched data
        setRecommendations(response.data);
      } catch (err) {
        console.error('Error fetching friend recommendations:', err); // Debugging: Check if there's an error
        setError('Failed to fetch recommendations. Please try again.');
      } finally {
        console.log('Loading set to false'); // Debugging: Check when loading is complete
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const addFriend = async (userId) => {
    console.log('Add friend button clicked for user ID:', userId); // Debugging: Check when the add friend button is clicked

    try {
      const fromUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('From User ID:', fromUserId); // Debugging: Check the sender's user ID
      console.log('Token:', token); // Debugging: Check the token

      if (!fromUserId || !token) {
        console.log('User not authenticated'); // Debugging: Check if authentication fails
        setError('User not authenticated. Please log in again.');
        return;
      }

      console.log('Sending friend request...'); // Debugging: Check when the friend request is sent
      await axios.post(
        'http://localhost:5000/send-friend-request',
        { fromUserId, toUserId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Friend request sent successfully'); // Debugging: Check if the request is successful
      alert('Friend request sent successfully!');
      setRecommendations((prev) => prev.filter((user) => user._id !== userId)); // Remove the user from recommendations
    } catch (err) {
      console.error('Error sending friend request:', err); // Debugging: Check if there's an error
      alert('Failed to send friend request. Please try again.');
    }
  };

  if (loading) {
    console.log('Loading recommendations...'); // Debugging: Check when loading is true
    return <p>Loading recommendations...</p>;
  }

  if (error) {
    console.log('Error:', error); // Debugging: Check when there's an error
    return <p className="text-red-500">{error}</p>;
  }

  console.log('Rendering recommendations:', recommendations); // Debugging: Check the recommendations being rendered

  return (
    <div>
      {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">Friend Recommendations</h2> */}
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((user) => (
            <li key={user._id} className="flex justify-between items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                {user.profilePicture ? (
                  <img
                    src={`http://localhost:5000/${user.profilePicture}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span className="text-gray-600 text-sm">No Image</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{user.name || user.username}</p>
                  <p className="text-sm text-gray-600">
                    {user.mutualFriends} mutual friends
                  </p>
                </div>
              </div>
              <button
                onClick={() => addFriend(user._id)}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 text-sm"
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No recommendations available.</p>
      )}
    </div>
  );
});

export default FriendRecommendations;