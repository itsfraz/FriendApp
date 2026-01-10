import React, { memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../config';

const FriendRecommendations = memo(() => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const { data: recommendations = [], isLoading, isError, error } = useQuery({
    queryKey: ['friendRecommendations', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/friend-recommendations/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });

  const addFriendMutation = useMutation({
    mutationFn: async (targetUserId) => {
      return axios.post(
        `${API_URL}/send-friend-request`,
        { fromUserId: userId, toUserId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onMutate: async (targetUserId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['friendRecommendations', userId]);

      // Snapshot the previous value
      const previousRecommendations = queryClient.getQueryData(['friendRecommendations', userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['friendRecommendations', userId], (old) => 
        old.filter(user => user._id !== targetUserId)
      );

      // Return a context object with the snapshotted value
      return { previousRecommendations };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['friendRecommendations', userId], context.previousRecommendations);
      alert('Failed to send friend request. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['friendRecommendations', userId]);
    },
    onSuccess: () => {
       alert('Friend request sent successfully!');
    }
  });

  if (isLoading) {
    return <p>Loading recommendations...</p>;
  }

  if (isError) {
    return <p className="text-red-500">{error.message || 'Failed to fetch recommendations.'}</p>;
  }

  return (
    <div className="w-full">
      {recommendations.length > 0 ? (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" layout>
          <AnimatePresence>
            {recommendations.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
              >
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
                 
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => addFriendMutation.mutate(user._id)}
                   disabled={addFriendMutation.isLoading}
                   className="mt-auto w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                 >
                   {addFriendMutation.isLoading ? 'Adding...' : 'Add Friend'}
                 </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-gray-500 text-center py-6">No recommendations available right now.</p>
      )}
    </div>
  );
});

export default FriendRecommendations;