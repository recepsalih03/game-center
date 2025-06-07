import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = io(SOCKET_URL, {
    reconnection: true,
    transports: ['websocket'],
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket.IO sunucusuna bağlandı:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket.IO sunucu bağlantısı kesildi.');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};