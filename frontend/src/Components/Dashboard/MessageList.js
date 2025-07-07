import React from 'react';

const MessageList = ({ messages }) => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === userId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`p-2 rounded-lg ${
              message.sender === userId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
