[file name]: SocketContext.js
[file content begin]
import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log('🚀 Initializing socket connection...');
    console.log('🌐 Connecting to:', 'https://friendapp-73st.onrender.com');
    
    // Create socket connection
    const newSocket = io('https://friendapp-73st.onrender.com', {
      // Transport configuration
      transports: ['websocket', 'polling'],
      upgrade: true,
      
      // Reconnection settings
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      
      // Timeout settings
      timeout: 20000,
      
      // For Render/Netlify deployment
      secure: true,
      rejectUnauthorized: false,
      
      // Path configuration (important!)
      path: '/socket.io/',
      
      // Additional headers if needed
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Debug: Log all events
    newSocket.onAny((event, ...args) => {
      console.log(`📥 [Socket Event] ${event}:`, args);
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket CONNECTED with ID:', newSocket.id);
      console.log('🔗 Transport:', newSocket.io.engine.transport.name);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket CONNECT ERROR:', error.message);
      console.error('📋 Error details:', {
        name: error.name,
        description: error.description,
        context: error.context
      });
      
      // Try different transport if WebSocket fails
      if (error.message === 'websocket error') {
        console.log('🔄 Switching to polling transport...');
        newSocket.io.opts.transports = ['polling', 'websocket'];
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket DISCONNECTED. Reason:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        console.log('🔄 Server disconnected socket. Reconnecting...');
        newSocket.connect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });

    // Ping event to test connection
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping', { time: Date.now() });
      }
    }, 10000);

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket connection...');
      clearInterval(pingInterval);
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
    };
  }, []);

  // Provide socket and connection status
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
[file content end]