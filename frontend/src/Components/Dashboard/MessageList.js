import React from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../../config';

const MessageList = ({ messages }) => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white">
      {messages.map((message, index) => {
        // Handle cases where message.sender might be an object or string
        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
        
        // Ensure robust comparison by converting to string
        const isSender = String(senderId) === String(userId);
        
        console.log('Debug Message:', {
             messageText: message.text, 
             sender: message.sender, 
             processedSenderId: senderId, 
             userIdFromStorage: userId, 
             isSender 
        });

        return (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex mb-2 ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                isSender
                  ? 'bg-[#0084ff] text-white rounded-br-sm'
                  : 'bg-[#e4e6eb] text-black rounded-bl-sm'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              {message.image && (
                <img 
                  src={`${API_URL}/${message.image}`} 
                  alt="shared" 
                  className={`max-w-full rounded-lg mb-1 ${message.text ? '' : ''}`}
                  style={{ maxHeight: '200px' }}
                />
              )}
              {message.text && <p>{message.text}</p>}
              <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isSender ? 'text-blue-200' : 'text-gray-500'}`}>
                <span>{new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                {isSender && (
                  <>
                    {/* Status Checkmarks */}
                    {message.status === 'sent' && <span>✓</span>}
                    {message.status === 'delivered' && <span>✓✓</span>}
                    {message.status === 'read' && <span className="text-white font-bold">✓✓</span>}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessageList;
