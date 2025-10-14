import { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { SocketContext } from './socketContext.js';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        timeout: 20000,
        forceNew: true
      });
      
      newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setConnected(true);
        newSocket.emit('authenticate', token);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setConnected(false);
      });

      newSocket.on('authenticated', (data) => {
        console.log('🔐 Authenticated:', data.user.username);
      });

      newSocket.on('authError', (error) => {
        console.error('🚫 Auth error:', error);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔌 Connection error:', error);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('🔄 Reconnection error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    } else {
      setSocket(null);
      setConnected(false);
    }
  }, [token, user]);

  const value = useMemo(() => ({
    socket,
    connected
  }), [socket, connected]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};