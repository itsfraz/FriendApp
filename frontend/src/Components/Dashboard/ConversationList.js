import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConversationList = ({ conversations, setCurrentChat }) => {
  const [users, setUsers] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      const newUsers = {};
      for (const conversation of conversations) {
        const friendId = conversation.members.find((member) => member !== userId);
        if (friendId) {
          if (conversation.friendData) {
            newUsers[friendId] = conversation.friendData;
          } else if (!users[friendId]) {
            try {
              const response = await axios.get(`https://friendapp-m7b4.onrender.com/user/${friendId}`);
              newUsers[friendId] = response.data;
            } catch (err) {
              console.error('Error fetching user:', err);
            }
          }
        }
      }
      setUsers((prevUsers) => ({ ...prevUsers, ...newUsers }));
    };

    fetchUsers();
  }, [conversations, userId, users]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      <ul>
        {conversations.map((conversation) => {
          const friendId = conversation.members.find((member) => member !== userId);
          const friend = users[friendId];

          return (
            <li
              key={conversation._id}
              className="flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
              onClick={() => setCurrentChat(conversation)}
            >
              {friend?.profilePicture && (
                <img
                  src={`https://friendapp-m7b4.onrender.com/${friend.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-semibold">{friend?.name}</p>
                <p className="text-sm text-gray-600">@{friend?.username}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
