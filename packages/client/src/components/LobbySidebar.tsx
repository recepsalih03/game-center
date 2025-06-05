import React from "react";
import { Paper, Typography } from "@mui/material";
import LobbyForm from "./LobbyForm";
import LobbyList, { LobbyItem } from "./LobbyList";
import { GameCardProps } from "./GameCard";

interface Props {
  games: GameCardProps[];
  lobbies: LobbyItem[];
  formState: {
    newLobbyName: string;
    setNewLobbyName: (v: string) => void;
    selectedGame: string;
    setSelectedGame: (v: string) => void;
    maxPlayers: number;
    setMaxPlayers: (v: number) => void;
    onCreate: () => void;
  };
  onJoin: (id: string) => void;
}

export default function LobbySidebar({ games, lobbies, formState, onJoin }: Props) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game Lobbies
      </Typography>

      <LobbyForm
        games={games}
        newLobbyName={formState.newLobbyName}
        setNewLobbyName={formState.setNewLobbyName}
        selectedGame={formState.selectedGame}
        setSelectedGame={formState.setSelectedGame}
        maxPlayers={formState.maxPlayers}
        setMaxPlayers={formState.setMaxPlayers}
        onCreate={formState.onCreate}
      />

      <Typography variant="subtitle1" gutterBottom>
        Available Lobbies
      </Typography>

      <LobbyList
        lobbies={lobbies}
        onJoin={onJoin}
      />
    </Paper>
  );
}