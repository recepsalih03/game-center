"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { Add, Event, Games, SportsEsports } from "@mui/icons-material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import type { Dayjs } from "dayjs"
import type { Game } from "../services/gamesService"

interface Props {
  games: Game[]
  onCreate: (data: any) => void
  canCreateLobby: boolean
}

export default function LobbyForm({ games, onCreate, canCreateLobby }: Props) {
  const theme = useTheme()
  const [lobbyType, setLobbyType] = useState<"normal" | "event">("normal")
  const [name, setName] = useState("")
  const [gameId, setGameId] = useState<number | string>("")
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [password, setPassword] = useState("")
  const [eventStartsAt, setEventStartsAt] = useState<Dayjs | null>(null)
  const [eventEndsAt, setEventEndsAt] = useState<Dayjs | null>(null)

  const handleCreate = () => {
    if (!name || !gameId) {
      alert("Lütfen lobi adını ve oyunu seçin.")
      return
    }

    if (lobbyType === "event" && (!eventStartsAt || !eventEndsAt)) {
      alert("Etkinlik için başlangıç ve bitiş tarihi girin.")
      return
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
    })
  }

  const radioLabelBaseSx = {
    m: 0,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 1,
    transition: "background-color 0.3s ease, color 0.3s ease",
    cursor: "pointer",
    "& .MuiRadio-root": {
      display: "none",
    },
  };

  const selectedSx = {
    bgcolor: "primary.main",
    color: "primary.contrastText",
  };

  const unselectedSx = {
    color: "text.secondary",
  };


  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Games color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Yeni Lobi Oluştur
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Fade in timeout={800}>
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Lobi Türü
              </Typography>
              <RadioGroup
                row
                value={lobbyType}
                onChange={(e) => setLobbyType(e.target.value as "normal" | "event")}
                sx={{
                  display: "flex",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SportsEsports fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Normal</Typography>
                    </Box>
                  }
                  disabled={!canCreateLobby}
                  sx={{
                    ...radioLabelBaseSx,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    ...(lobbyType === "normal" ? selectedSx : unselectedSx),
                  }}
                />
                <FormControlLabel
                  value="event"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Event fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Etkinlik</Typography>
                    </Box>
                  }
                  disabled={!canCreateLobby}
                  sx={{
                    ...radioLabelBaseSx,
                    ...(lobbyType === "event" ? selectedSx : unselectedSx),
                  }}
                />
              </RadioGroup>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Lobi Adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                disabled={!canCreateLobby}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <TextField
                select
                label="Oyun Seç"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                fullWidth
                size="small"
                disabled={!canCreateLobby}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="" disabled>
                  Oyun Seçiniz
                </MenuItem>
                {games.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Max Oyuncu"
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                fullWidth
                size="small"
                disabled={!canCreateLobby}
                inputProps={{ min: 2, max: 10 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              {lobbyType === "event" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <DateTimePicker
                      label="Etkinlik Başlangıç"
                      value={eventStartsAt}
                      onChange={setEventStartsAt}
                      slotProps={{ textField: { fullWidth: true, size: "small", disabled: !canCreateLobby, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2 } } } }}
                    />
                    <DateTimePicker
                      label="Etkinlik Bitiş"
                      value={eventEndsAt}
                      onChange={setEventEndsAt}
                      slotProps={{ textField: { fullWidth: true, size: "small", disabled: !canCreateLobby, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2 } } } }}
                    />
                  </Box>
                </LocalizationProvider>
              )}

              <TextField
                label="Lobi Şifresi (Opsiyonel)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
                disabled={!canCreateLobby}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={handleCreate}
                disabled={!canCreateLobby}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[4],
                  },
                  "&:disabled": {
                    background: alpha(theme.palette.action.disabled, 0.3),
                  },
                  transition: "all 0.2s ease",
                }}
              >
                LOBİ OLUŞTUR
              </Button>
            </Box>
          </Box>
        </Fade>
      </CardContent>
    </Card>
  )
}