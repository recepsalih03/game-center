"use client"
import React, { useState } from "react"
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material"
import { Add } from "@mui/icons-material"
import { Game } from "../services/gamesService"

interface Props {
  games: Game[];
  onCreate: (name: string, gameId: number, maxPlayers: number) => void;
}

export default function LobbyForm({ games, onCreate }: Props) {
  const [lobbyName, setLobbyName] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | string>("");
  const [maxPlayers, setMaxPlayers] = useState(4);

  const handleCreate = () => {
    if (!lobbyName || !selectedGameId) {
      alert("Lütfen lobi adını ve oyunu seçin.");
      return;
    }
    onCreate(lobbyName, Number(selectedGameId), maxPlayers);
    setLobbyName("");
    setSelectedGameId("");
    setMaxPlayers(4);
  };

  return (
    <Box mb={4}>
      <Typography variant="subtitle1" gutterBottom>Yeni Lobi Oluştur</Typography>
      <TextField
        fullWidth
        label="Lobi Adı"
        margin="dense"
        size="small"
        value={lobbyName}
        onChange={(e) => setLobbyName(e.target.value)}
      />
      <TextField
        select
        fullWidth
        label="Oyun Seç"
        margin="dense"
        size="small"
        value={selectedGameId}
        onChange={(e) => setSelectedGameId(Number(e.target.value))}
      >
        <MenuItem value="" disabled><em>Oyun Seçiniz</em></MenuItem>
        {games.map((game) => (
          <MenuItem key={game.id} value={game.id}>
            {game.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Max Oyuncu"
        type="number"
        margin="dense"
        size="small"
        InputProps={{ inputProps: { min: 2, max: 10 } }}
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(Number(e.target.value))}
      />
      <Button
        variant="contained"
        color="success"
        startIcon={<Add />}
        fullWidth
        sx={{ mt: 1.5 }}
        onClick={handleCreate}
      >
        Lobi Oluştur
      </Button>
    </Box>
  )
}