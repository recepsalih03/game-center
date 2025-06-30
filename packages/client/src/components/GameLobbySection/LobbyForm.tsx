import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import type { Game } from "../../services/gamesService";

interface Props {
  games: Game[];
  onCreate: (data: any) => void;
  canCreateLobby: boolean;
}

export default function LobbyForm({ games, onCreate, canCreateLobby }: Props) {
  const [lobbyType, setLobbyType] = useState<"normal" | "event">("normal");
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState<number | string>("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [password, setPassword] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState<Dayjs | null>(null);
  const [eventEndsAt, setEventEndsAt] = useState<Dayjs | null>(null);

  const handleCreate = () => {
    if (!name || !gameId) {
      alert("Lütfen lobi adını ve oyunu seçin.");
      return;
    }
    if (lobbyType === "event" && (!eventStartsAt || !eventEndsAt)) {
      alert("Etkinlik için başlangıç ve bitiş tarihi girin.");
      return;
    }

    onCreate({
      lobbyType,
      name,
      gameId: Number(gameId),
      maxPlayers,
      password,
      ...(lobbyType === "event"
        ? {
            eventStartsAt: eventStartsAt!.toISOString(),
            eventEndsAt: eventEndsAt!.toISOString(),
          }
        : {}),
    });
  };

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" gutterBottom>
        Yeni Lobi Oluştur
      </Typography>

      <Box mb={2}>
        <RadioGroup
          row
          value={lobbyType}
          onChange={e => setLobbyType(e.target.value as "normal" | "event")}
        >
          <FormControlLabel
            value="normal"
            control={<Radio />}
            label="Normal"
            disabled={!canCreateLobby}
          />
          <FormControlLabel
            value="event"
            control={<Radio />}
            label="Etkinlik"
            disabled={!canCreateLobby}
          />
        </RadioGroup>
      </Box>

      <TextField
        label="Lobi Adı"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        margin="dense"
        size="small"
        disabled={!canCreateLobby}
      />

      <TextField
        select
        label="Oyun Seç"
        value={gameId}
        onChange={e => setGameId(e.target.value)}
        fullWidth
        margin="dense"
        size="small"
        disabled={!canCreateLobby}
      >
        <MenuItem value="" disabled>
          Oyun Seçiniz
        </MenuItem>
        {games.map(g => (
          <MenuItem key={g.id} value={g.id}>
            {g.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Max Oyuncu"
        type="number"
        value={maxPlayers}
        onChange={e => setMaxPlayers(Number(e.target.value))}
        fullWidth
        margin="dense"
        size="small"
        disabled={!canCreateLobby}
      />

      {lobbyType === "event" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Etkinlik Başlangıç"
            value={eventStartsAt}
            onChange={setEventStartsAt}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "dense",
                size: "small",
                disabled: !canCreateLobby,
              },
            }}
          />
          <DateTimePicker
            label="Etkinlik Bitiş"
            value={eventEndsAt}
            onChange={setEventEndsAt}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "dense",
                size: "small",
                disabled: !canCreateLobby,
              },
            }}
          />
        </LocalizationProvider>
      )}

      <TextField
        label="Lobi Şifresi (Opsiyonel)"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="dense"
        size="small"
        disabled={!canCreateLobby}
      />

      <Button
        variant="contained"
        startIcon={<Add />}
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleCreate}
        disabled={!canCreateLobby}
      >
        Lobi Oluştur
      </Button>
    </Paper>
  );
}