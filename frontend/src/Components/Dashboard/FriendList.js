// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function FriendsList() {
//   const [friends, setFriends] = useState([]); // State to store the friend list
//   const [loading, setLoading] = useState(true); // State to handle loading
//   const [error, setError] = useState(null); // State to handle errors

//   useEffect(() => {
//     const fetchFriendList = async () => {
//       const token = localStorage.getItem('token');
//       const userId = localStorage.getItem('userId'); // Get the user ID from localStorage

//       try {
//         console.log("Fetching friend list for user ID:", userId); // Debugging

//         // Fetch the friend list with name and profilePicture
//         const response = await axios.get(`http://localhost:5000/friend-list/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("Friend list fetched successfully:", response.data); // Debugging

//         setFriends(response.data); // Set the friend list
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching friend list:", err); // Debugging
//         setError(err.response?.data?.message || 'Something went wrong');
//         setLoading(false);
//       }
//     };

//     fetchFriendList();
//   }, []);

//   if (loading) {
//     return <p>Loading friends...</p>;
//   }

//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }

//   return (
//     <div>
//       {friends.length > 0 ? (
//         <ul>
//           {friends.map((friend) => (
//             <li key={friend._id} className="flex items-center mb-4">
//               {friend.profilePicture && (
//                 <img
//                   src={`http://localhost:5000/${friend.profilePicture}`} // Serve the image from the backend
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//               )}
//               <div>
//                 <p className="font-semibold">{friend.name}</p>
//                 <p className="text-sm text-gray-600">@{friend.username}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No friends found.</p>
//       )}
//     </div>
//   );
// }

// export default FriendsList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendList = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/friend-list/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchFriendList();
  }, []);

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend._id} className="flex items-center mb-4">
              {friend.profilePicture && (
                <img
                  src={`http://localhost:5000/${friend.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-semibold">{friend.name}</p>
                <p className="text-sm text-gray-600">@{friend.username}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
}

export default FriendsList