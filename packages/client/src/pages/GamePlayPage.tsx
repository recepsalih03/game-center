"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Fade,
  useTheme,
  alpha,
  Chip,
  Avatar,
  AvatarGroup,
} from "@mui/material"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { TombalaBoard } from "game-tombala"
import { useSocket } from "../contexts/SocketContext"
import { AuthContext } from "../contexts/AuthContext"
import { type Game, getGameById } from "../services/gamesService"
import HeaderBar from "../components/HeaderBar"
import AvatarMenu from "../components/AvatarMenu"
import ProfileDialog from "../components/ProfileDialog"
import GameOverDialog from "../components/GameOverDialog"
import { SportsEsports, People, Timeline } from "@mui/icons-material"

export default function GamePlayPage() {
  const theme = useTheme()
  const { id: gameId } = useParams<{ id: string }>()
  const location = useLocation()
  const socket = useSocket()
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [gameState, setGameState] = useState<any>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [profile, setProfile] = useState(false)
  const [isGameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState("")

  const lobbyId = location.state?.lobbyId

  useEffect(() => {
    if (!gameId) {
      setLoading(false)
      setError("Oyun ID'si bulunamadı.")
      return
    }
    getGameById(gameId)
      .then(setGame)
      .catch(() => setError("Oyun bilgileri yüklenemedi."))
      .finally(() => setLoading(false))
  }, [gameId])

  useEffect(() => {
    if (!socket) return

    socket.emit("join_game_room", lobbyId)

    const handleWinVerified = ({ winnerUsername, claimType }: { winnerUsername: string; claimType: string }) =>
      setGameLog((prev) => [...prev, `🎉 ${winnerUsername}, ${claimType.toUpperCase()} yaptı! 🎉`])

    const handleGameStateUpdate = (state: any) => setGameState(state)

    const handleGameOver = ({ winnerUsername }: { winnerUsername: string }) => {
      setWinner(winnerUsername)
      setGameOver(true)
    }

    socket.on("win_verified", handleWinVerified)
    socket.on("game_state_update", handleGameStateUpdate)
    socket.on("game_over", handleGameOver)

    return () => {
      socket.off("win_verified")
      socket.off("game_state_update")
      socket.off("game_over")
    }
  }, [socket, lobbyId])

  const handleLogout = () => {
    if (logout) logout()
    navigate("/")
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()

  if (loading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  if (!game) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Oyun bulunamadı.</Typography>
      </Box>
    )
  }

  return (
    <>
      <CssBaseline />
      <GameOverDialog open={isGameOver} winner={winner} />

      <HeaderBar
        username={user.username}
        notifCount={0}
        onAvatarClick={(e) => setAnchor(e.currentTarget)}
        getInitials={initials}
      />

      <AvatarMenu
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        onProfile={() => setProfile(true)}
        onLogout={handleLogout}
      />

      <ProfileDialog
        open={profile}
        onClose={() => setProfile(false)}
        username={user.username}
        memberSince="Mayıs 2025"
        getInitials={initials}
      />

      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <SportsEsports color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {game.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Oyun devam ediyor...
                </Typography>
              </Box>
            </Box>

            {gameState?.players && (
              <Box display="flex" alignItems="center" gap={2}>
                <Chip icon={<People />} label={`${gameState.players.length} Oyuncu`} variant="outlined" />
                <AvatarGroup max={4}>
                  {gameState.players.map((player: string, index: number) => (
                    <Avatar
                      key={player}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                        fontSize: "0.8rem",
                      }}
                    >
                      {initials(player)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Game Board */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <TombalaBoard socket={socket} lobbyId={lobbyId} username={user.username} gameState={gameState} />
              </Paper>
            </Fade>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Fade in timeout={1200}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Timeline color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Oyun Durumu
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {gameState?.cinko1 && (
                        <Chip label={`1. Çinko: ${gameState.cinko1}`} color="warning" variant="filled" size="small" />
                      )}
                      {gameState?.cinko2 && (
                        <Chip label={`2. Çinko: ${gameState.cinko2}`} color="secondary" variant="filled" size="small" />
                      )}
                      {gameState?.tombala && (
                        <Chip label={`Tombala: ${gameState.tombala}`} color="primary" variant="filled" size="small" />
                      )}
                      {!gameState?.cinko1 && !gameState?.cinko2 && !gameState?.tombala && (
                        <Typography variant="body2" color="text.secondary">
                          Henüz kazanan yok...
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>

              <Fade in timeout={1400}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    maxHeight: 400,
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Typography variant="h6" fontWeight={600}>
                        Oyun Geçmişi
                      </Typography>
                    </Box>

                    <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                      {gameLog.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Henüz bir etkinlik yok
                          </Typography>
                        </Box>
                      ) : (
                        <List sx={{ p: 0 }}>
                          {gameLog.map((log, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                borderBottom:
                                  index < gameLog.length - 1
                                    ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                    : "none",
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                                },
                              }}
                            >
                              <ListItemText
                                primary={log}
                                primaryTypographyProps={{
                                  variant: "body2",
                                  sx: { fontWeight: 500 },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
