// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function SignUp() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     // Frontend password validation using the regex
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       setError(
//         'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
//       );
//       return;
//     }

//     // Create a FormData object
//     const formData = new FormData();
//     formData.append('username', username);
//     formData.append('password', password);
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('profilePicture', profilePicture);

//     try {
//       const response = await axios.post('http://localhost:5000/signup', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Signup response:', response.data);

//       // Set userId and token in localStorage (if the backend returns them)
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userId', response.data.userId);

//       console.log('User ID set in localStorage:', response.data.userId);

//       setSuccess('User created successfully!');
//       setError('');
//       setUsername('');
//       setPassword('');
//       setName('');
//       setEmail('');
//       setProfilePicture(null);

//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//         {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
//         <form onSubmit={handleSignUp}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'} // Toggle between text and password
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//             <p className="text-sm text-gray-500 mt-2">
//               Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).
//             </p>
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture:</label>
//             <input
//               type="file"
//               onChange={(e) => setProfilePicture(e.target.files[0])}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // export default SignUp;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      );
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      setSuccess("User created successfully!");
      setError("");
      setUsername("");
      setPassword("");
      setName("");
      setEmail("");
      setProfilePicture(null);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
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
              <p className="text-lg opacity-90 mb-8">Join our community and connect with friends from all over the world.</p>
              <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-full">
                 <span className="text-4xl">🚀</span>
              </div>
           </div>
           {/* Decorative Circles */}
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500 mb-6 text-sm">Please fill in the details below to sign up.</p>

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

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Name & Username Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="relative">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                    <div className="relative">
                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">👤</span>
                       <input
                         type="text"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                         placeholder="John Doe"
                         required
                       />
                    </div>
                 </div>
                 <div className="relative">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Username</label>
                    <div className="relative">
                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">@</span>
                       <input
                         type="text"
                         value={username}
                         onChange={(e) => setUsername(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                         placeholder="johndoe"
                         required
                       />
                    </div>
                 </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">📧</span>
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                     placeholder="john@example.com"
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
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition"
                     placeholder="••••••••"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-blue-600 transition"
                   >
                     {showPassword ? "Hide" : "Show"}
                   </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 special char.
                </p>
              </div>

              {/* Profile Picture */}
              <div className="relative">
                 <label className="text-xs font-semibold text-gray-600 mb-1 block">Profile Picture</label>
                 <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                       {profilePicture ? (
                          <img src={URL.createObjectURL(profilePicture)} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-lg">📷</span>
                       )}
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                      className="block w-full text-xs text-gray-500
                        file:mr-4 file:py-1 file:px-3
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 transition
                      "
                      required
                    />
                 </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 text-sm mt-4"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center">
               <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">
                     Log in
                  </button>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
