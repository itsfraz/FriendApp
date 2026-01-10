import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import { SocketProvider } from './context/SocketContext'; // Import the SocketProvider
import { HelmetProvider } from 'react-helmet-async';

// Lazy load components for performance
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));
const EditProfile = lazy(() => import('./Components/Dashboard/EditProfile'));
const ChangePassword = lazy(() => import('./Components/Dashboard/ChangePassword'));
const Chat = lazy(() => import('./Components/Dashboard/Chat'));

// PrivateRoute component to protect the Dashboard route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />; // Redirect to login if no token
};

// Loading Fallback Component
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Clear the token from localStorage when the app initializes
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null); // Update the token state to null
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <SocketProvider>
          <Router>
            <Suspense fallback={<Loading />}>
            <Routes>
              {/* Define the root path to redirect to /dashboard if logged in, else /login */}
              <Route
                path="/"
                element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
              />

              {/* Login route */}
              <Route path="/login" element={<Login />} />

              {/* Signup route */}
              <Route path="/signup" element={<Signup />} />

              {/* Forgot Password route */}
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Reset Password route */}
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Dashboard route (protected) */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Edit Profile route (protected) */}
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                }
              />

              {/* Change Password route (protected) */}
              <Route
                path="/change-password"
                element={
                  <PrivateRoute>
                    <ChangePassword />
                  </PrivateRoute>
                }
              />

              {/* Chat route (protected) */}
              <Route
                path="/chat/:conversationId"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />

              {/* Fallback route for unmatched paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </SocketProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;