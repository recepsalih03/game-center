import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

const SOCKET_URL = 'http://localhost:4000';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = io(SOCKET_URL, {
    reconnection: true,
    transports: ['websocket'],
    autoConnect: false,
  });

  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect();

      socket.on('connect', () => {
        console.log('✅ Socket.IO sunucusuna bağlandı:', socket.id);
        socket.emit('register_user', user.username);
      });

      // DÜZELTME: Davet alma olayını dinliyoruz
      socket.on('receive_invite', ({ fromUser, gameTitle, gameId }) => {
        toast.info(`💌 ${fromUser} sizi "${gameTitle}" oynamaya davet ediyor!`);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket.IO sunucu bağlantısı kesildi.');
      });
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};