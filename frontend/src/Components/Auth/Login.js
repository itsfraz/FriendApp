// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// function Login() {
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Login form submitted');

//     try {
//       console.log("Form data being sent:", formData);

//       const response = await axios.post('https://friendapp-m7b4.onrender.com/login', formData);
//       console.log('Login response:', response.data);

//       if (!response.data.token || !response.data.userId) {
//         console.error("Token or userId missing in the response:", response.data);
//         setError('Invalid response from the server. Please try again.');
//         return;
//       }

//       // Set token and userId in localStorage
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userId', response.data.userId);

//       // Verify that userId and token are set correctly
//       console.log("Token set in localStorage:", response.data.token);
//       console.log("User ID set in localStorage:", response.data.userId);

//       setSuccess('Login successful!');
//       setError('');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 2000);
//     } catch (err) {
//       console.error('Login error:', err);

//       if (err.response) {
//         console.error("Backend error response:", err.response.data);
//         setError(err.response.data.message || 'Something went wrong');
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>
//         {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//         {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
//             <input
//               type="text"
//               name="username"
//               placeholder="Enter your username"
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'} // Toggle between text and password
//                 name="password"
//                 placeholder="Enter your password"
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//               >
//                 {showPassword ? 'Hide' : 'Show'}
//               </button>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </form>
//         <p className="text-center text-gray-600 mt-4">
//           Don't have an account?{' '}
//           <Link to="/signup" className="text-blue-500 hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://friendapp-m7b4.onrender.com/login', formData);
      if (!response.data.token || !response.data.userId) {
        setError('Invalid response from the server. Please try again.');
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      setSuccess('Login successful!');
      setError('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;