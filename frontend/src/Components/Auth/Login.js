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

//       const response = await axios.post('http://localhost:5000/login', formData);
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
      const response = await axios.post('http://localhost:5000/login', formData);
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
    <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="flex w-full h-full max-w-[1600px] shadow-2xl rounded-none md:rounded-2xl overflow-hidden bg-white">
        
        {/* Left Side - Visual & Branding (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
           <div className="z-10 text-center text-white px-10">
              <h1 className="text-5xl font-extrabold mb-4">Welcome Back!</h1>
              <p className="text-lg opacity-90 mb-8">Login to access your dashboard and connect with your friends.</p>
              <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg">
                 <span className="text-4xl">👋</span>
              </div>
           </div>
           {/* Decorative Circles */}
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-500 mb-8 text-sm">Please enter your credentials to continue.</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-xs rounded" role="alert">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-xs rounded" role="alert">
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Username</label>
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">@</span>
                   <input
                     type="text"
                     name="username"
                     placeholder="Enter your username"
                     onChange={handleChange}
                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                     required
                   />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔒</span>
                   <input
                     type={showPassword ? 'text' : 'password'}
                     name="password"
                     placeholder="Enter your password"
                     onChange={handleChange}
                     className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-blue-600 transition"
                   >
                     {showPassword ? 'Hide' : 'Show'}
                   </button>
                </div>
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">Forgot Password?</Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 text-sm"
              >
                Login
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                     Sign Up
                  </Link>
               </p>
            </div>

             {/* Divider for potential social logins */}
             <div className="my-6 flex items-center justify-between">
                <span className="w-1/5 border-b lg:w-1/4"></span>
                <span className="text-xs text-center text-gray-400 uppercase">or continue with</span>
                <span className="w-1/5 border-b lg:w-1/4"></span>
             </div>
             
             <div className="flex justify-center gap-4">
                 <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                    <span className="text-xl">Google</span> 
                 </button>
                 <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                    <span className="text-xl">Github</span>
                 </button>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;