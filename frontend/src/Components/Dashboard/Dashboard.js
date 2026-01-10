import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import FriendsList from "./FriendList";
import FriendRecommendations from "./FriendRecommendations";
import SearchUsers from "./SearchUsers";
import PendingFriendRequests from "./PendingFriendRequests";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../../features/auth/authSlice";
import { fetchFriends } from "../../features/friends/friendsSlice";
import { addNotification, clearNotifications } from "../../features/notifications/notificationsSlice";
import SocketContext from "../../context/SocketContext";
import { useTheme } from "../../context/ThemeContext";
import { API_URL } from '../../config';
import echoLogo from '../../assets/echo_logo.png';
import { logout as logoutService } from '../../Services/authService';
import { Helmet } from 'react-helmet-async';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: notifications } = useSelector((state) => state.notifications);

  const [requestSent, setRequestSent] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // friendsUpdated removed, we will rely on Redux updates or smart fetching
  // For now keeping local state if strictly needed for other components not yet on redux, but FriendList will be updated.
  // const [friendsUpdated, setFriendsUpdated] = useState(false); 
  
  const [activeTab, setActiveTab] = useState("feed");
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [userId, dispatch]);

  // ... (keep useEffect for socket logic) ...

  useEffect(() => {
    if (socket && userId) {
      socket.emit("user-login", userId);
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket) {
      socket.on("new-friend-request", (data) => {
        dispatch(addNotification({
            type: "friend-request",
            message: data.message,
            fromUserId: data.fromUserId,
        }));
      });

      socket.on("friend-request-accepted", (data) => {
        dispatch(addNotification({
            type: "friend-request-accepted",
            message: data.message,
            toUserId: data.toUserId,
        }));
        // Ideally dispatch fetchFriends here if FriendsList is listening to store
        // or re-fetch friend list
      });

      socket.on("receive-message", (data) => {
         dispatch(addNotification({
            type: 'message',
            message: `New message: ${data.text.substring(0, 30)}${data.text.length > 30 ? '...' : ''}`,
            fromUserId: data.sender,
         }));
      });
    }

    return () => {
      if (socket) {
        socket.off("new-friend-request");
        socket.off("friend-request-accepted");
        socket.off("receive-message");
      }
    };
  }, [socket]);

  // ... (keep handler functions) ...

  const handleSignOut = async () => {
    try {
        await logoutService(); // Clear cookie on server
    } catch (e) {
        console.error("Logout failed", e);
    }
    dispatch(logout()); // Clear redux
    window.location.href = "/login";
  };

  const handleDeleteProfile = async () => {
    // ... (keep existing implementation)
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `${API_URL}/delete-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } catch (err) {
        console.error("Error deleting profile:", err);
        alert("Failed to delete profile. Please try again.");
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-16 md:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-black'}`}>
      <Helmet>
        <title>Dashboard - Echo</title>
        <meta name="description" content="Echo Dashboard - Connect with friends and chat." />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Helmet>
      {/* Top Navigation Bar */}
      <nav className={`px-4 py-2 shadow-sm sticky top-0 z-50 flex items-center justify-between h-16 transition-colors duration-300 backdrop-blur-md border-b border-white/10 ${theme === 'dark' ? 'bg-glass-dark text-white' : 'bg-glass-light/80 text-gray-800'}`}>
        {/* Logo Section */}
        {/* Logo Section - Hides text on small screens to save space for search */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={echoLogo} alt="Echo Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hidden md:block">
              Echo
            </h1>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 md:hidden">
              Echo
            </h1>
          </div>

        {/* Search Bar - Hidden on small screens */}
        {/* Search Bar - Responsive */}
        {/* Search Bar - Responsive */}
        <div className="flex-1 max-w-sm md:max-w-xl mx-2 md:mx-4 relative">
             <SearchUsers setRequestSent={setRequestSent} />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme} 
             className={`p-2 rounded-full transition duration-300 ${theme === 'dark' ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
           >
             {theme === 'dark' ? '☀️' : '🌙'}
           </button>
           {/* Notification Bell */}
           <div className="relative">
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition relative"
             >
               <span className="text-xl">🔔</span>
               {notifications.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                   {notifications.length}
                 </span>
               )}
             </button>
             
             {/* Notification Dropdown */}
             {showNotifications && (
               <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                 <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                   <h3 className="font-bold text-gray-700">Notifications</h3>
                   {notifications.length > 0 && (
                     <button onClick={() => dispatch(clearNotifications())} className="text-xs text-blue-600 hover:text-blue-800">
                       Mark all as read
                     </button>
                   )}
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   {notifications.length > 0 ? (
                     notifications.map((notif, i) => (
                       <div key={i} className="p-3 border-b hover:bg-gray-50 flex items-start gap-3 transition">
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                             notif.type === 'message' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="text-sm text-gray-800 leading-snug">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">Just now</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="p-8 text-center text-gray-500 text-sm">
                       No new notifications
                     </div>
                   )}
                 </div>
               </div>
             )}
           </div>


        </div>
      </nav>

      <motion.div 
        className="max-w-[1600px] mx-auto pt-6 px-4 md:px-8 grid grid-cols-1 md:grid-cols-[280px_1fr_300px] gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        
        {/* Left Sidebar - Navigation & Profile */}
        <motion.div 
          className={`${activeTab === 'profile' ? 'block' : 'hidden'} md:block space-y-4`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
        >
           {/* Profile Card */}
           <div className={`rounded-xl shadow-lg p-4 hover:shadow-xl transition backdrop-blur-md border border-white/20 ${theme === 'dark' ? 'bg-glass-dark text-white' : 'bg-glass-light text-gray-800'}`}>
              <div className="flex flex-col items-center">
                 <img
                  src={user?.profilePicture ? `${API_URL}/${user.profilePicture}` : "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 mb-2"
                 />
                 <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user?.name}</h2>
                 <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>@{user?.username}</p>
                 
                 {/* Bio Section */}
                 {user?.bio && <p className={`text-center text-sm mb-3 px-2 italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{user.bio}"</p>}
                 
                 {/* Details */}
                 <div className="w-full space-y-2 mb-4">
                    {user?.work && (
                       <div className={`flex items-center text-sm px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="mr-2">💼</span>
                          <span>{user.work}</span>
                       </div>
                    )}
                    {user?.location && (
                       <div className={`flex items-center text-sm px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="mr-2">📍</span>
                          <span>{user.location}</span>
                       </div>
                    )}
                 </div>

                 <div className="w-full mt-2 space-y-2">
                    <Link to="/edit-profile" className={`flex items-center justify-center space-x-2 w-full py-2 font-medium rounded-full transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                       <span className="text-xl">✏️</span>
                       <span>Edit Profile</span>
                    </Link>
                    <Link to="/change-password" className={`flex items-center justify-center space-x-2 w-full py-2 font-medium rounded-full transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                       <span className="text-xl">🔒</span>
                       <span>Change Password</span>
                    </Link>
                    <button onClick={handleDeleteProfile} className={`flex items-center justify-center space-x-2 w-full py-2 font-medium rounded-full transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-red-900 text-red-400' : 'bg-gray-100 hover:bg-red-100 text-red-600'}`}>
                       <span className="text-xl">🗑️</span>
                       <span>Delete Profile</span>
                    </button>
                    <button onClick={handleSignOut} className={`flex items-center justify-center space-x-2 w-full py-2 font-medium rounded-full transition duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-red-900 text-red-400' : 'bg-gray-100 hover:bg-red-100 text-red-600'}`}>
                       <span className="text-xl">🚪</span>
                       <span>Sign Out</span>
                    </button>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Center Feed - Main Content */}
        <motion.div 
          className={`${activeTab === 'feed' ? 'block' : 'hidden'} md:block space-y-6 pb-10`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
        >
           {/* Pending Requests */}
           <div className={`rounded-xl shadow-lg p-4 md:p-6 backdrop-blur-md border border-white/20 ${theme === 'dark' ? 'bg-glass-dark' : 'bg-glass-light'}`}>
             <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800'}`}>Friend Requests</h3>
             <PendingFriendRequests 
                requestSent={requestSent} 
                onFriendAccepted={() => dispatch(fetchFriends(userId))}  
             />
           </div>

           {/* Recommendations */}
           <div className={`rounded-xl shadow-lg p-4 md:p-6 backdrop-blur-md border border-white/20 ${theme === 'dark' ? 'bg-glass-dark' : 'bg-glass-light'}`}>
             <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800'}`}>People You May Know</h3>
             <FriendRecommendations />
           </div>
        </motion.div>

        {/* Right Sidebar - Contacts */}
        <motion.div 
          className={`${activeTab === 'contacts' ? 'block' : 'hidden'} md:block`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
        >
           <div className="sticky top-20">
              <div className={`rounded-xl shadow-lg p-4 h-[calc(100vh-100px)] overflow-y-auto backdrop-blur-md border border-white/20 ${theme === 'dark' ? 'bg-glass-dark text-white' : 'bg-glass-light text-gray-800'}`}>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Contacts</h3>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 </div>
                 <FriendsList />
              </div>
           </div>
        </motion.div>

      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-3 z-50 backdrop-blur-md ${theme === 'dark' ? 'bg-glass-dark border-white/10' : 'bg-glass-light/90 border-white/20'}`}>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center ${activeTab === 'feed' ? 'text-blue-600' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center ${activeTab === 'contacts' ? 'text-blue-600' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
        >
          <span className="text-2xl">👥</span>
          <span className="text-xs">Friends</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </div>

    </div>
  );
}

export default Dashboard;
