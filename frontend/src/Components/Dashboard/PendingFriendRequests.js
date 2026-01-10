import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';

function PendingFriendRequests({ requestSent }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestStatusChanged, setRequestStatusChanged] = useState(false); // New state

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

    useEffect(() => {
    const fetchPendingRequests = async () => {
      try {


        const response = await axios.get(
          `${API_URL}/pending-friend-requests/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRequests(response.data);
      } catch (err) {
         console.error('Error fetching pending friend requests:', err);
        if (err.response) {
          setError(err.response?.data?.message || 'Failed to fetch pending friend requests. Please try again.');
        } else if (err.request) {

          setError('No response received. Please check your network connection.');
        } else {
          console.error('Error message:', err.message);
          setError('Something went wrong. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
      if (userId && token)
        fetchPendingRequests();
      else {

        setError("User ID or Token not found");
        setLoading(false);
      }
  }, [userId, token, requestStatusChanged, requestSent]); // Important: Include requestStatusChanged and requestSent


  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        `${API_URL}/respond-friend-request`,
        { requestId, status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Friend request accepted!');
      setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
      );
        setRequestStatusChanged(prev => !prev);
    } catch (err) {
      console.error('Error accepting friend request:', err);
      toast.error('Failed to accept friend request. Please try again.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        `${API_URL}/respond-friend-request`,
        { requestId, status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Friend request rejected!');
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
      );
       setRequestStatusChanged(prev => !prev);
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      toast.error('Failed to reject friend request. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading pending friend requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      {requests.length > 0 ? (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-0">
                 {request.from && (
                    <img 
                      src={request.from.profilePicture ? `${API_URL}/${request.from.profilePicture}` : "https://via.placeholder.com/40"} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                 )}
                 <div>
                    <span className="font-semibold text-gray-800 text-sm block">
                        {request.from ? request.from.name || request.from.username : 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">wants to be friends</span>
                 </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No pending requests.</p>
      )}
    </div>
  );
}

export default PendingFriendRequests;