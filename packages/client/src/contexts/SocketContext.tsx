import React, { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import InviteNotification from '../components/InviteNotification';
import { usePageFocus } from '../hooks/usePageFocus';

const SOCKET_URL = 'http://localhost:4000';

const socket = io(SOCKET_URL, {
  reconnection: true,
  transports: ['websocket'],
  autoConnect: false,
});

const SocketContext = createContext<Socket | null>(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

const flashTitle = (newTitle: string, originalTitle: string) => {
  if (document.hasFocus()) return;
  
  let isFlashing = true;
  document.title = newTitle;

  const stopFlashing = () => {
    isFlashing = false;
    document.title = originalTitle;
    window.removeEventListener('focus', stopFlashing);
  };

  const flashInterval = setInterval(() => {
    if (!isFlashing) {
      clearInterval(flashInterval);
      return;
    }
    document.title = document.title === originalTitle ? newTitle : originalTitle;
  }, 1000);

  window.addEventListener('focus', stopFlashing, { once: true });
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isPageFocused = usePageFocus();
  const originalTitleRef = useRef(document.title);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user]);

  useEffect(() => {
    const onConnect = () => {
      if(user) {
        socket.emit('register_user', user.username);
      }
    };

    const onReceiveInvite = (data: any) => {
      toast(<InviteNotification {...data} />);
      if (!isPageFocused) {
        try {
          new Audio('/notification.mp3').play().catch(() => {});
        } catch (e) {}
        flashTitle('💌 Yeni Davet!', originalTitleRef.current);
      }
    };

    const onNavigate = ({ gameId, lobbyId }: { gameId: number, lobbyId: string }) => {
      navigate(`/play/${gameId}`, { state: { lobbyId } });
    };
    
    socket.on('connect', onConnect);
    socket.on('receive_invite', onReceiveInvite);
    socket.on('navigate_to_game', onNavigate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('receive_invite', onReceiveInvite);
      socket.off('navigate_to_game', onNavigate);
    };
  }, [user, isPageFocused, navigate]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};