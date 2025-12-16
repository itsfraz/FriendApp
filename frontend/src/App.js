import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
import EditProfile from './Components/Dashboard/EditProfile'; // Import the EditProfile component
import ChangePassword from './Components/Dashboard/ChangePassword'; // Import the ChangePassword component
import Chat from './Components/Dashboard/Chat'; // Import the Chat component
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

import { SocketProvider } from './context/SocketContext'; // Import the SocketProvider

// PrivateRoute component to protect the Dashboard route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />; // Redirect to login if no token
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Clear the token from localStorage when the app initializes
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null); // Update the token state to null
  }, []);

  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
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
      </Router>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;