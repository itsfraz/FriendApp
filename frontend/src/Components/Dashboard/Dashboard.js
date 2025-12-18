import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import FriendsList from "./FriendList";
import FriendRecommendations from "./FriendRecommendations";
import SearchUsers from "./SearchUsers";
import PendingFriendRequests from "./PendingFriendRequests";
import { useNavigate, Link } from "react-router-dom";
import SocketContext from "../../context/SocketContext";
import { useTheme } from "../../context/ThemeContext";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState('');
  const [work, setWork] = useState('');
  const [location, setLocation] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [friendsUpdated, setFriendsUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://friendapp-73st.onrender.com/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsername(response.data.username);
        setName(response.data.name);
        setProfilePicture(response.data.profilePicture);
        setBio(response.data.bio || '');
        setWork(response.data.work || '');
        setLocation(response.data.location || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // ... (keep useEffect for socket logic) ...

  useEffect(() => {
    if (socket && userId) {
      socket.emit("user-login", userId);
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket) {
      socket.on("new-friend-request", (data) => {
        setNotifications((prev) => [
          {
            type: "friend-request",
            message: data.message,
            fromUserId: data.fromUserId,
            timestamp: new Date()
          },
          ...prev,
        ]);
      });

      socket.on("friend-request-accepted", (data) => {
        setNotifications((prev) => [
          {
            type: "friend-request-accepted",
            message: data.message,
            toUserId: data.toUserId,
            timestamp: new Date()
          },
            ...prev,
        ]);
        setFriendsUpdated(prev => !prev);
      });

      socket.on("receive-message", (data) => {
         setNotifications((prev) => [
            {
               type: 'message',
               message: `New message: ${data.text.substring(0, 30)}${data.text.length > 30 ? '...' : ''}`,
               fromUserId: data.sender,
               timestamp: new Date()
            },
            ...prev
         ]);
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
          `https://friendapp-73st.onrender.com/delete-profile/${userId}`,
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
    <div className={`min-h-screen font-sans pb-16 md:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#f0f2f5] text-black'}`}>
      {/* Top Navigation Bar */}
      <nav className={`px-4 py-2 shadow-sm sticky top-0 z-50 flex items-center justify-between h-16 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        {/* Logo Section */}
        {/* Logo Section - Hides text on small screens to save space for search */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer hidden md:block" onClick={() => navigate('/')}>
            SocialApp
          </h1>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer md:hidden" onClick={() => navigate('/')}>
            SA
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
                     <button onClick={() => setNotifications([])} className="text-xs text-blue-600 hover:text-blue-800">
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

      <div className="max-w-[1600px] mx-auto pt-6 px-4 md:px-8 grid grid-cols-1 md:grid-cols-[280px_1fr_300px] gap-6">
        
        {/* Left Sidebar - Navigation & Profile */}
        <div className={`${activeTab === 'profile' ? 'block' : 'hidden'} md:block space-y-4`}>
           {/* Profile Card */}
           <div className={`rounded-xl shadow-sm p-4 hover:shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex flex-col items-center">
                 <img
                  src={profilePicture ? `https://friendapp-73st.onrender.com/${profilePicture}` : "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 mb-2"
                 />
                 <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{name}</h2>
                 <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>@{username}</p>
                 
                 {/* Bio Section */}
                 {bio && <p className={`text-center text-sm mb-3 px-2 italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{bio}"</p>}
                 
                 {/* Details */}
                 <div className="w-full space-y-2 mb-4">
                    {work && (
                       <div className={`flex items-center text-sm px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="mr-2">💼</span>
                          <span>{work}</span>
                       </div>
                    )}
                    {location && (
                       <div className={`flex items-center text-sm px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="mr-2">📍</span>
                          <span>{location}</span>
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
        </div>

        {/* Center Feed - Main Content */}
        <div className={`${activeTab === 'feed' ? 'block' : 'hidden'} md:block space-y-6 pb-10`}>
           {/* Pending Requests */}
           <div className={`rounded-xl shadow-sm p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
             <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800'}`}>Friend Requests</h3>
             <PendingFriendRequests 
                requestSent={requestSent} 
                onFriendAccepted={() => setFriendsUpdated(prev => !prev)} 
             />
           </div>

           {/* Recommendations */}
           <div className={`rounded-xl shadow-sm p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
             <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800'}`}>People You May Know</h3>
             <FriendRecommendations />
           </div>
        </div>

        {/* Right Sidebar - Contacts */}
        <div className={`${activeTab === 'contacts' ? 'block' : 'hidden'} md:block`}>
           <div className="sticky top-20">
              <div className={`rounded-xl shadow-sm p-4 h-[calc(100vh-100px)] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Contacts</h3>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 </div>
                 <FriendsList refresh={friendsUpdated} />
              </div>
           </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-3 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
