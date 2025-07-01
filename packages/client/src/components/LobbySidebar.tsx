"use client"

import { Typography, Divider, Box, useTheme, alpha } from "@mui/material"
import { SportsEsports } from "@mui/icons-material"
import LobbyForm from "./GameLobbySection/LobbyForm"
import LobbyList from "./GameLobbySection/LobbyList"
import type { Lobby } from "../services/lobbiesService"
import type { Game } from "../services/gamesService"

interface Props {
  games: Game[]
  lobbies: Lobby[]
  onCreateLobby: (data: Partial<Lobby>) => void
  onJoin: (lobbyId: string, gameId: number, password?: string) => void
  onLeave: (lobbyId: string) => void
  onInvite: (lobby: Lobby) => void
  onStartGame: (lobbyId: string) => void
  canCreateLobby: boolean
}

export default function LobbySidebar({
  games,
  lobbies,
  onCreateLobby,
  onJoin,
  onLeave,
  onInvite,
  onStartGame,
  canCreateLobby,
}: Props) {
  const theme = useTheme()

  return (
    <Box sx={{ p: 3, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SportsEsports sx={{ color: "white", fontSize: 24 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Oyun Lobileri
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <LobbyForm games={games} onCreate={onCreateLobby} canCreateLobby={canCreateLobby} />
      </Box>

      <Divider
        sx={{
          my: 3,
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
        }}
      />

      <LobbyList lobbies={lobbies} onJoin={onJoin} onLeave={onLeave} onInvite={onInvite} onStartGame={onStartGame} />
    </Box>
  )
}
