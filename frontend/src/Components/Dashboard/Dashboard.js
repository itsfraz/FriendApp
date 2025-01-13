import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import FriendsList from "./FriendList";
import FriendRecommendations from "./FriendRecommendations";
import SearchUsers from "./SearchUsers";
import PendingFriendRequests from "./PendingFriendRequests";
import { useNavigate, Link } from "react-router-dom";
import SocketContext from "../../context/SocketContext";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("user-login", userId);
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket) {
      socket.on("new-friend-request", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            type: "friend-request",
            message: data.message,
            fromUserId: data.fromUserId,
          },
        ]);
      });

      socket.on("friend-request-accepted", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            type: "friend-request-accepted",
            message: data.message,
            toUserId: data.toUserId,
          },
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new-friend-request");
        socket.off("friend-request-accepted");
      }
    };
  }, [socket]);

  const renderNotifications = () => {
    return notifications.map((notification, index) => (
      <div key={index} className="p-2 mb-2 bg-blue-100 rounded-lg">
        <p>{notification.message}</p>
      </div>
    ));
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        const response = await axios.delete(
          `https://friendapp-m7b4.onrender.com/delete-profile/${userId}`,
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://friendapp-m7b4.onrender.com/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsername(response.data.username);
        setName(response.data.name);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Notifications</h2>
          {notifications.length > 0 ? (
            renderNotifications()
          ) : (
            <p>No new notifications.</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {profilePicture && (
              <img
                src={`https://friendapp-m7b4.onrender.com/${profilePicture}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">Social</h1>
              {username && (
                <>
                  <p className="text-gray-600 text-sm">UserName: {username}</p>
                  <p className="text-gray-600 text-sm">Name: {name}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Link
              to="/edit-profile"
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="mr-2">✏️</span>
              Edit Profile
            </Link>
            {/* Change Password Button */}
            <Link
              to="/change-password"
              className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="mr-2">🔒</span>
              Change Password
            </Link>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
            {/* Delete Profile Button */}
            <button
              onClick={handleDeleteProfile}
              className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="mr-2">🗑️</span>
              Delete Profile
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Users
          </h2>
          <SearchUsers setRequestSent={setRequestSent} />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Left Column: Pending Friend Requests and Friend Recommendations */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Pending Friend Requests */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Pending Friend Requests
              </h2>
              <PendingFriendRequests requestSent={requestSent} />
            </div>

            {/* Friend Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Friend Recommendations
              </h2>
              <FriendRecommendations />
            </div>
          </div>

          {/* Right Column: Your Friends */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex-1 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Friends
            </h2>
            <FriendsList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
