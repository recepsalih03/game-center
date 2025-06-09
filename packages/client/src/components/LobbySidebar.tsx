import React from "react";
import { Paper, Typography, Divider, Button } from "@mui/material";
import LobbyForm from "./LobbyForm";
import LobbyList from "./GameLobbySection/LobbyList";
import { Lobby } from "../services/lobbiesService";
import { Game } from "../services/gamesService";

interface Props {
  games: Game[];
  lobbies: Lobby[];
  onCreateLobby: (name: string, gameId: number, maxPlayers: number) => void;
  onJoin: (lobbyId: string) => void;
  onLeave: (lobbyId: string) => void;
  onInvite: (lobby: Lobby) => void;
  onStartGame: (lobbyId: string) => void;
}

export default function LobbySidebar({ games, lobbies, onCreateLobby, onJoin, onLeave, onInvite, onStartGame }: Props) {

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Oyun Lobileri
      </Typography>
      <LobbyForm games={games} onCreate={onCreateLobby} />
      <Divider sx={{ my: 2 }} />
      <LobbyList 
        lobbies={lobbies} 
        onJoin={onJoin} 
        onLeave={onLeave} 
        onInvite={onInvite} 
        onStartGame={onStartGame} 
      />
    </Paper>
  );
}