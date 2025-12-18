import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null); 
  const [isFriendTyping, setIsFriendTyping] = useState(false); // Typing indicator state
  const [typingTimeout, setTypingTimeout] = useState(null); // Ref for debounce, but state works too for simple usage
  const socket = useContext(SocketContext);
  const userId = localStorage.getItem('userId');
  const { conversationId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchFriendDetails = async () => {
       if (currentChat) {
          const friendId = currentChat.members.find((member) => member !== userId);
          if (friendId) {
             // Check if friend data was passed via location state (optimization)
             if (location.state?.friend && location.state.friend._id === friendId) {
                setCurrentFriend(location.state.friend);
             } else {
                try {
                   const res = await axios.get(`https://friendapp-73st.onrender.com/user/${friendId}`);
                   setCurrentFriend(res.data);
                } catch (err) {
                   console.error("Error fetching friend details:", err);
                }
             }
          }
       }
    };
    fetchFriendDetails();
  }, [currentChat, userId, location.state]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`https://friendapp-73st.onrender.com/api/conversations/${userId}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userId]);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const selectedConversation = conversations.find(conv => conv._id === conversationId);
      if (selectedConversation) {
        setCurrentChat(selectedConversation);
      } else if (location.state?.friend) {
        // If conversation doesn't exist in list but we have friend data (New Chat)
        // Check if we already have a temporary chat set to avoid loop
        if (currentChat?._id !== conversationId) {
            const newConversation = {
            _id: conversationId,
            members: [userId, location.state.friend._id],
            friendData: location.state.friend, 
            };
            setCurrentChat(newConversation);
            // Do NOT setConversations here; let the backend handle the creation logic 
            // and re-fetch or add it when the first message is sent.
        }
      }
    }
  }, [conversationId, conversations, location.state, userId]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        if (currentChat?._id === message.conversationId) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleTyping = ({ conversationId, userId: typerId }) => {
         if (currentChat?._id === conversationId && typerId !== userId) {
            setIsFriendTyping(true);
         }
      };

      const handleStopTyping = ({ conversationId, userId: typerId }) => {
         if (currentChat?._id === conversationId && typerId !== userId) {
            setIsFriendTyping(false);
         }
      };

      socket.on('receive-message', handleReceiveMessage);
      socket.on('typing', handleTyping);
      socket.on('stop-typing', handleStopTyping);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('stop-typing', handleStopTyping);
      };
    }
  }, [socket, currentChat, userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`https://friendapp-73st.onrender.com/api/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
      socket.emit('join-chat', currentChat._id);
    }
  }, [currentChat, socket]);

  const handleTyping = () => {
    if (currentChat) {
      socket.emit('typing', { conversationId: currentChat._id, userId });
      
      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        socket.emit('stop-typing', { conversationId: currentChat._id, userId });
      }, 3000); // Stop typing after 3 seconds of inactivity

      setTypingTimeout(timeout);
    }
  };

  const handleSendMessage = async (text, image) => {
    let imagePath = '';

    if (image) {
       const formData = new FormData();
       formData.append('image', image);
       try {
          const res = await axios.post('https://friendapp-73st.onrender.com/api/chat/upload', formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
          });
          imagePath = res.data.filePath;
       } catch (err) {
          console.error("Image upload failed", err);
          return; // Stop if upload fails
       }
    }

    const message = {
      conversationId: currentChat._id,
      sender: userId,
      text,
      image: imagePath
    };

    socket.emit('send-message', message);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <ConversationList
          conversations={conversations}
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
        />
      </div>
      <div className="w-3/4 flex flex-col">
        {currentChat ? (

          <>
            {/* Chat Header */}
            <div className="flex items-center p-3 border-b bg-white shadow-sm z-10">
               {currentFriend && (
                 <>
                   <img
                     src={currentFriend.profilePicture ? `https://friendapp-73st.onrender.com/${currentFriend.profilePicture}` : "https://via.placeholder.com/40"}
                     alt="Profile"
                     className="w-10 h-10 rounded-full object-cover mr-3"
                   />
                   <div>
                     <h3 className="font-bold text-gray-800 text-lg">{currentFriend.name || currentFriend.username}</h3>
                     <span className="text-sm text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active Now
                     </span>
                   </div>
                 </>
               )}
            </div>

            <MessageList messages={messages} />
            {isFriendTyping && (
               <div className="px-4 py-2 text-sm text-gray-500 italic animate-pulse">
                  {currentFriend?.name || 'Friend'} is typing...
               </div>
            )}
            <MessageInput handleSendMessage={handleSendMessage} onTyping={handleTyping} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
