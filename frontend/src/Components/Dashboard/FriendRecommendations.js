import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';

const FriendRecommendations = memo(() => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



  useEffect(() => {


    const fetchRecommendations = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');



      if (!userId || !token) {

        setError('User not authenticated. Please log in again.');
        setLoading(false);
        return;
      }

      try {

        const response = await axios.get(
          `${API_URL}/friend-recommendations/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRecommendations(response.data);
      } catch (err) {
        console.error('Error fetching friend recommendations:', err); // Debugging: Check if there's an error
        setError('Failed to fetch recommendations. Please try again.');
      } finally {

        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

const addFriend = async (userId) => {

    try {
      const fromUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');



      if (!fromUserId || !token) {

        setError('User not authenticated. Please log in again.');
        return;
      }


      await axios.post(
        `${API_URL}/send-friend-request`,
        { fromUserId, toUserId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      alert('Friend request sent successfully!');
      setRecommendations((prev) => prev.filter((user) => user._id !== userId)); // Remove the user from recommendations
    } catch (err) {
      console.error('Error sending friend request:', err); // Debugging: Check if there's an error
      alert('Failed to send friend request. Please try again.');
    }
  };

  if (loading) {

    return <p>Loading recommendations...</p>;
  }

  if (error) {

    return <p className="text-red-500">{error}</p>;
  }



  return (
    <div className="w-full">
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((user) => (
            <div key={user._id} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
               <div className="mb-3">
                 {user.profilePicture ? (
                   <img
                     src={`${API_URL}/${user.profilePicture}`}
                     alt="Profile"
                     className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                   />
                 ) : (
                   <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm">
                     <span className="text-gray-400 text-2xl">?</span>
                   </div>
                 )}
               </div>
               
               <h3 className="font-bold text-gray-800 text-base mb-1 truncate w-full">{user.name || user.username}</h3>
               {user.mutualFriends > 0 && (
                   <p className="text-xs text-gray-500 mb-3">{user.mutualFriends} mutual friends</p>
               )}
               
               <button
                 onClick={() => addFriend(user._id)}
                 className="mt-auto w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
               >
                 Add Friend
               </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No recommendations available right now.</p>
      )}
    </div>
  );
});

export default FriendRecommendations;