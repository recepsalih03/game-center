import { useContext } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import { joinLobby, Lobby } from '../services/lobbiesService';
import { toast } from 'react-toastify';
import { Game } from '../services/gamesService';
import { useNavigate } from 'react-router-dom';

export const useLobbyActions = (games: Game[], lobbies: Lobby[]) => {
  const socket = useSocket();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleJoin = async (lobbyId: string, gameId: number) => {
    try {
      await joinLobby(lobbyId);
      toast.success("Lobiye katıldınız!");
      navigate(`/game/${gameId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Lobiye katılamadınız.");
    }
  };

  const handleInvite = (lobbyId: string, lobbyName: string) => {
    if (!socket || !user) return;
    
    const toUser = prompt("Kimi davet etmek istersiniz? (Kullanıcı adını girin)");
    const lobby = lobbies.find(l => l.id === lobbyId);
    const game = games.find(g => g.id === lobby?.gameId);

    if (toUser && lobby && game) {
      socket.emit('send_invite', {
        fromUser: user.username,
        toUser: toUser,
        lobbyId: lobby.id,
        lobbyName: lobby.name,
        gameTitle: game.title,
      });
      toast.info(`${toUser} kullanıcısına davet gönderildi!`);
    }
  };

  return { handleJoin, handleInvite };
};