import React from 'react';
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
          <div
            key={index}
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
