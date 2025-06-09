import React, { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import InviteNotification from '../components/InviteNotification';
import { usePageFocus } from '../hooks/usePageFocus';

const SOCKET_URL = 'http://localhost:4000';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const flashTitle = (newTitle: string, originalTitle: string, duration: number) => {
  let isFlashing = true;
  let counter = 0;
  const interval = setInterval(() => {
    if (!isFlashing) {
      clearInterval(interval);
      document.title = originalTitle;
      return;
    }
    document.title = document.title === originalTitle ? newTitle : originalTitle;
    counter++;
    if (counter >= duration * 2) {
      isFlashing = false;
    }
  }, 500);

  const stopFlashing = () => {
    isFlashing = false;
  };
  window.addEventListener('focus', stopFlashing, { once: true });
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isPageFocused = usePageFocus();
  const originalTitleRef = useRef(document.title);

  const socket = io(SOCKET_URL, {
    reconnection: true,
    transports: ['websocket'],
    autoConnect: false,
  });

  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect();

      socket.on('connect', () => {
        socket.emit('register_user', user.username);
      });

      socket.on('receive_invite', (data) => {
        toast(<InviteNotification {...data} />);
        
        if (!isPageFocused) {
          try {
            const audio = new Audio('/notification.mp3');
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {});
            }
          } catch(e) {}
          flashTitle(`💌 Yeni Davet!`, originalTitleRef.current, 6);
        }
      });

      socket.on('disconnect', () => {});
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user, socket, isPageFocused]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};