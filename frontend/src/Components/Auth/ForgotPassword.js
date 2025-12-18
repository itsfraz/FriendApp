import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://friendapp-73st.onrender.com/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
      // For demo purposes, we can navigate directly or show the token. 
      // In a real app, the user would check email. 
      // Here we will auto-redirect to reset password with the token for convenience.
      if (res.data.token) {
        setTimeout(() => {
             navigate(`/reset-password/${res.data.token}`);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        <p className="text-gray-500 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        
        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message} <br/> Redirecting...</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
         <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-gray-700">Back to Login</button>
         </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
