
import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Request Interceptor to add Access Token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.get(`${API_URL}/refresh-token`, { 
            withCredentials: true 
        });

        const newAccessToken = data.token;
        localStorage.setItem('token', newAccessToken);

        // Update header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired:", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (data) => api.post('/signup', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');

export default api; // Default export for use in thunks
