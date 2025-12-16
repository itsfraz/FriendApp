import React, { useState } from 'react';

const MessageInput = ({ handleSendMessage, onTyping }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (onTyping) onTyping();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() || image) {
      handleSendMessage(text, image);
      setText('');
      setImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-200">
      {image && (
        <div className="mb-2 p-2 bg-white rounded-lg inline-block relative">
           <span className="text-xs text-gray-500">{image.name}</span>
           <button 
             type="button" 
             onClick={() => setImage(null)}
             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
           >
             ×
           </button>
        </div>
      )}
      <div className="flex items-center">
        <label className="cursor-pointer p-2 mr-2 text-gray-500 hover:text-gray-700 bg-white rounded-full">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange}
          />
          📷
        </label>
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
