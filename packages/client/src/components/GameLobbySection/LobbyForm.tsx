import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem, RadioGroup, FormControlLabel, Radio, FormControl, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Game } from "../../services/gamesService";

interface Props {
  games: Game[];
  onCreate: (data: any) => void;
  canCreateLobby: boolean;
}

export default function LobbyForm({ games, onCreate, canCreateLobby }: Props) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState<number | string>("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [lobbyType, setLobbyType] = useState<'normal' | 'event'>('normal');
  const [password, setPassword] = useState('');
  const [eventStartsAt, setEventStartsAt] = useState('');
  const [eventEndsAt, setEventEndsAt] = useState('');

  const handleCreate = () => {
    if (!name || !gameId) {
      alert("Lütfen lobi adını ve oyunu seçin.");
      return;
    }
    const commonData = { name, gameId: Number(gameId), maxPlayers, lobbyType, password };
    const eventData = lobbyType === 'event' ? { eventStartsAt, eventEndsAt } : {};
    onCreate({ ...commonData, ...eventData });
  };

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>Yeni Lobi Oluştur</Typography>
      
      <TextField fullWidth margin="dense" size="small" label="Lobi Adı" value={name} onChange={e => setName(e.target.value)} disabled={!canCreateLobby} />
      
      <TextField
        select
        fullWidth
        label="Oyun Seç"
        margin="dense"
        size="small"
        value={gameId}
        onChange={(e) => setGameId(Number(e.target.value))}
        disabled={!canCreateLobby}
      >
        <MenuItem value="" disabled>Oyun Seçiniz</MenuItem>
        {games.map((game) => (
          <MenuItem key={game.id} value={game.id}>
            {game.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField fullWidth margin="dense" size="small" type="number" label="Max Oyuncu" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} disabled={!canCreateLobby} />
      <TextField fullWidth margin="dense" size="small" type="password" label="Lobi Şifresi (Opsiyonel)" value={password} onChange={e => setPassword(e.target.value)} disabled={!canCreateLobby} />
      
      <Button fullWidth sx={{ mt: 2 }} startIcon={<Add/>} variant="contained" color="success" onClick={handleCreate} disabled={!canCreateLobby}>
        Lobi Oluştur
      </Button>
      {!canCreateLobby && <Typography variant="caption" color="error" sx={{mt: 1, display: 'block', textAlign: 'center'}}>Zaten bir lobiniz var. Yeni lobi oluşturamazsınız.</Typography>}
    </Paper>
  );
}