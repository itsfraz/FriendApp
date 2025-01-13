import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        console.log("Fetching pending requests for user ID:", userId);
        console.log("Token:", token);

        const response = await axios.get(
          `https://friendapp-m7b4.onrender.com/pending-friend-requests/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Full response data:", response);
        console.log("Pending friend requests fetched:", response.data);

        setRequests(response.data);
      } catch (err) {
         console.error('Error fetching pending friend requests:', err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          setError(err.response?.data?.message || 'Failed to fetch pending friend requests. Please try again.');
        } else if (err.request) {
          console.error("Request:", err.request);
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
         console.log("User ID or Token not found");
        setError("User ID or Token not found");
        setLoading(false);
      }
  }, [userId, token, requestStatusChanged, requestSent]); // Important: Include requestStatusChanged and requestSent


  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        'https://friendapp-m7b4.onrender.com/respond-friend-request',
        { requestId, status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Friend request accepted!');
      setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
      );
        setRequestStatusChanged(prev => !prev);
    } catch (err) {
      console.error('Error accepting friend request:', err);
      alert('Failed to accept friend request. Please try again.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        'https://friendapp-m7b4.onrender.com/respond-friend-request',
        { requestId, status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Friend request rejected!');
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
      );
       setRequestStatusChanged(prev => !prev);
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      alert('Failed to reject friend request. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading pending friend requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Friend Requests</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => {
            console.log("Request object:", request);

            return (
            <li key={request._id} className="flex justify-between items-center mb-2">
                <span>
                {request.from && request.from.username
                ? request.from.username
                : 'User Deleted'}
                </span>
                <div>
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
             );
          })}
        </ul>
      ) : (
        <p>No pending friend requests.</p>
      )}
    </div>
  );
}

export default PendingFriendRequests;