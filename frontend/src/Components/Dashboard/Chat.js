import React, { useState, useEffect, useContext } from 'react';
import api from '../../Services/authService';
import { useParams, useLocation } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null); 
  const [isFriendTyping, setIsFriendTyping] = useState(false); // Typing indicator state
  const [typingTimeout, setTypingTimeout] = useState(null); // Ref for debounce, but state works too for simple usage
  const { socket } = useContext(SocketContext);
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
                   const res = await api.get(`/user/${friendId}`);
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
      setConversationsLoading(true);
      try {
        const res = await api.get(`/api/conversations/${userId}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setConversationsLoading(false);
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
  }, [conversationId, conversations, location.state, userId, currentChat?._id]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        if (currentChat?._id === message.conversationId) {
          setMessages((prev) => [...prev, message]);
           // If we are in the chat room, mark as read immediately
           socket.emit('mark-messages-read', { conversationId: message.conversationId, userId });
        } else {
           // If we are online but not in the chat, mark as delivered
           socket.emit('message-delivered', { messageId: message._id });
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

      const handleMessageStatusUpdate = (updatedMessage) => {
         if (currentChat?._id === updatedMessage.conversationId) {
            setMessages((prev) => 
               prev.map((msg) => msg._id === updatedMessage._id ? updatedMessage : msg)
            );
         }
      };

      const handleMessagesRead = ({ conversationId }) => {
         if (currentChat?._id === conversationId) {
            setMessages((prev) => 
               prev.map((msg) => ({ ...msg, status: 'read' }))
            );
         }
      };

      socket.on('receive-message', handleReceiveMessage);
      socket.on('typing', handleTyping);
      socket.on('stop-typing', handleStopTyping);
      socket.on('message-status-update', handleMessageStatusUpdate);
      socket.on('messages-read', handleMessagesRead);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('stop-typing', handleStopTyping);
        socket.off('message-status-update', handleMessageStatusUpdate);
        socket.off('messages-read', handleMessagesRead);
      };
    }
  }, [socket, currentChat, userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await api.get(`/api/messages/${currentChat?._id}`);
        setMessages(res.data);
        
        // Mark messages as read when entering the chat
        if (socket && currentChat?._id) {
           socket.emit('mark-messages-read', { conversationId: currentChat._id, userId });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
      socket.emit('join-chat', currentChat._id);
    }
  }, [currentChat, socket, userId]);

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
          const res = await api.post(`/api/chat/upload`, formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
          });
          imagePath = res.data.filePath;
       } catch (err) {
          console.error("Image upload failed", err);
          toast.error("Failed to upload image");
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
          isLoading={conversationsLoading}
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
                     src={currentFriend.profilePicture ? `${API_URL}/${currentFriend.profilePicture}` : "https://via.placeholder.com/40"}
                     alt="Profile"
                     className="w-10 h-10 rounded-full object-cover mr-3"
                   />
                   <div>
                     <h3 className="font-bold text-gray-800 text-lg">{currentFriend.name || currentFriend.username}</h3>
                     {isFriendTyping ? (
                        <span className="text-sm text-blue-500 flex items-center gap-1 italic typing-indicator font-medium">
                           Typing<span>.</span><span>.</span><span>.</span>
                        </span>
                     ) : (
                        <span className="text-sm text-green-500 flex items-center gap-1">
                           <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active Now
                        </span>
                     )}
                   </div>
                 </>
               )}
            </div>

            <MessageList messages={messages} />

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
