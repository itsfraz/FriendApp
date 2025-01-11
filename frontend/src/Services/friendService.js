import axios from 'axios';

export const getFriends = (token) =>
  axios.get('/api/friends', { headers: { Authorization: `Bearer ${token}` } });

export const getFriendRecommendations = (token) =>
  axios.get('/api/friends/recommendations', { headers: { Authorization: `Bearer ${token}` } });
