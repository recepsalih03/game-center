import { useContext, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import { joinLobby, leaveLobby, Lobby } from '../services/lobbiesService';
import { toast } from 'react-toastify';
import { Game } from '../services/gamesService';
import { useNavigate } from 'react-router-dom';

export const useLobbyActions = (games: Game[]) => {
  const socket = useSocket();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitingLobby, setInvitingLobby] = useState<Lobby | null>(null);

  const handleJoin = async (lobbyId: string, gameId: number) => {
    try {
      await joinLobby(lobbyId);
      socket?.emit('join_game_room', lobbyId);
      navigate(`/game/${gameId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Lobiye katılamadınız.");
    }
  };

  const handleLeave = async (lobbyId: string) => {
    try {
      await leaveLobby(lobbyId);
      socket?.emit('leave_game_room', lobbyId);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Lobiden ayrılamadınız.");
    }
  };

  const handleInvite = (lobby: Lobby) => {
    setInvitingLobby(lobby);
    setInviteModalOpen(true);
  };
  
  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setInvitingLobby(null);
  };

  const handleStartGame = (lobbyId: string) => {
    if (socket) {
      socket.emit('start_game', lobbyId);
    }
  };

  return { handleJoin, handleLeave, handleInvite, handleStartGame, isInviteModalOpen, invitingLobby, closeInviteModal };
};