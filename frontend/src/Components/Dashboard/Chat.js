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
  const socket = useContext(SocketContext);
  const userId = localStorage.getItem('userId');
  const { conversationId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`https://friendapp-m7b4.onrender.com/api/conversations/${userId}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userId]);

  useEffect(() => {
    if (conversationId) {
      const selectedConversation = conversations.find(conv => conv._id === conversationId);
      if (selectedConversation) {
        setCurrentChat(selectedConversation);
      } else if (location.state?.friend) {
        const newConversation = {
          _id: conversationId,
          members: [userId, location.state.friend._id],
          friendData: location.state.friend, // Store friend data for display
        };
        setConversations(prev => [...prev, newConversation]);
        setCurrentChat(newConversation);
      }
    }
  }, [conversationId, conversations, location.state, userId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        if (currentChat?._id === message.conversationId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, [socket, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`https://friendapp-m7b4.onrender.com/api/messages/${currentChat?._id}`);
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

  const handleSendMessage = async (text) => {
    const message = {
      conversationId: currentChat._id,
      sender: userId,
      text,
    };

    socket.emit('send-message', message);
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <ConversationList
          conversations={conversations}
          setCurrentChat={setCurrentChat}
        />
      </div>
      <div className="w-3/4 flex flex-col">
        {currentChat ? (
          <>
            <MessageList messages={messages} />
            <MessageInput handleSendMessage={handleSendMessage} />
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
