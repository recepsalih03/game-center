import React from "react";
import { Paper, Typography, Divider, Button } from "@mui/material";
import LobbyForm from "./LobbyForm";
import LobbyList from "./GameLobbySection/LobbyList";
import { Lobby } from "../services/lobbiesService";
import { Game } from "../services/gamesService";
import { useSocket } from "../contexts/SocketContext";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
  games: Game[];
  lobbies: Lobby[];
  onCreateLobby: (name: string, gameId: number, maxPlayers: number) => void;
  onJoin: (lobbyId: string, gameId: number) => void;
  onInvite: (lobbyId: string, lobbyName: string) => void;
}

export default function LobbySidebar({ games, lobbies, onCreateLobby, onJoin, onInvite }: Props) {
  const socket = useSocket();
  const { user } = useContext(AuthContext);

  const handleGlobalInvite = () => {
    if (!user) {
      alert("Davet göndermek için giriş yapmış olmalısınız.");
      return;
    }
    const toUser = prompt("Kimi davet etmek istersiniz? (Kullanıcı adını girin)");
    const gameId = prompt("Hangi oyuna davet etmek istersiniz? (Oyun ID'sini girin)");
    
    if (toUser && gameId && socket) {
      const game = games.find(g => g.id === Number(gameId));
      if (game) {
        socket.emit('send_invite', {
          fromUser: user.username,
          toUser: toUser,
          lobbyId: '', 
          lobbyName: game.title + ' oyunu',
          gameTitle: game.title,
        });
        alert(`${toUser} kullanıcısına davet gönderildi!`);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Oyun Lobileri
      </Typography>
      <Button variant="outlined" fullWidth onClick={handleGlobalInvite} sx={{ mb: 2 }}>
        Oyuncu Davet Et
      </Button>
      <LobbyForm games={games} onCreate={onCreateLobby} />
      <Divider sx={{ my: 2 }} />
      <LobbyList lobbies={lobbies} onJoin={onJoin} onInvite={onInvite} />
    </Paper>
  );
}