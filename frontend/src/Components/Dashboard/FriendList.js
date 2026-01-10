import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends } from '../../features/friends/friendsSlice';
import { API_URL } from '../../config';

function FriendsList() {
  const dispatch = useDispatch();
  const { list: friends, loading, error } = useSelector((state) => state.friends);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId && friends.length === 0) {
       dispatch(fetchFriends(userId));
    }
  }, [userId, dispatch, friends.length]);

  const handleFriendClick = async (friend) => {
    try {
      const response = await axios.post(`${API_URL}/api/conversations`, {
        senderId: userId,
        receiverId: friend._id,
      });
      navigate(`/chat/${response.data._id}`, { state: { friend } });
    } catch (err) {
      console.error('Error creating or finding conversation:', err);
    }
  };

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {friends.length > 0 ? (
        <ul className="space-y-1">
          {friends.map((friend) => (
            <motion.li
              key={friend._id}
              className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleFriendClick(friend)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                {friend.profilePicture ? (
                  <img
                    src={`${API_URL}/${friend.profilePicture}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                )}
                {/* Online Indicator Mockup */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              <div className="ml-3">
                <p className="font-semibold text-gray-800 text-sm">{friend.name}</p>
                <p className="text-xs text-gray-500">@{friend.username}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">No friends yet.</p>
      )}
    </div>
  );
}

export default FriendsList;
