import React, { useState } from 'react';

const MessageInput = ({ handleSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      handleSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-200">
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
