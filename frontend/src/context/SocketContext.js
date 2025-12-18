import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://friendapp-73st.onrender.com'); // Connect to the backend
    setSocket(newSocket);

    return () => newSocket.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
