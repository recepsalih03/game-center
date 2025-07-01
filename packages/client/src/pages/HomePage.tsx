"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Container,
  CssBaseline,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  Fade,
  useTheme,
  alpha,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { AuthContext } from "../contexts/AuthContext"
import { useSocket } from "../contexts/SocketContext"
import { type Game, getGames } from "../services/gamesService"
import { type Lobby, getAllLobbies, createLobby } from "../services/lobbiesService"
import { useLobbyActions } from "../hooks/useLobbyActions"
import HeaderBar from "../components/HeaderBar"
import AvatarMenu from "../components/AvatarMenu"
import ProfileDialog from "../components/ProfileDialog"
import GamesGrid from "../components/GamesGrid"
import LobbySidebar from "../components/LobbySidebar"
import InvitePlayerDialog from "../components/InvitePlayerDialog"

export default function HomePage() {
  const theme = useTheme()
  const { user, logout } = useContext(AuthContext)
  const socket = useSocket()
  const navigate = useNavigate()
  const [games, setGames] = useState<Game[]>([])
  const [lobbies, setLobbies] = useState<Lobby[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const { handleJoin, handleLeave, handleInvite, handleStartGame, isInviteModalOpen, invitingLobby, closeInviteModal } =
    useLobbyActions(games)

  const canCreateLobby = user
    ? !lobbies.some(
        (l) =>
          l.playerUsernames[0] === user.username && (l.lobbyType !== "event" || dayjs(l.eventEndsAt).isAfter(dayjs())),
      )
    : false

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const [gamesData, lobbiesData] = await Promise.all([getGames(), getAllLobbies()])
        setGames(gamesData)
        setLobbies(lobbiesData)
      } catch {
        setError("Veriler yüklenemedi.")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleLobbyCreated = (newLobby: Lobby) => setLobbies((prev) => [newLobby, ...prev])
    const handleLobbyUpdated = (updatedLobby: Lobby) =>
      setLobbies((prev) => prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)))
    const handleLobbyDeleted = (data: { id: string }) => setLobbies((prev) => prev.filter((l) => l.id !== data.id))
    const handleNavigate = ({ gameId, lobbyId }: { gameId: number; lobbyId: string }) =>
      navigate(`/play/${gameId}`, { state: { lobbyId } })

    socket.on("lobby_created", handleLobbyCreated)
    socket.on("lobby_updated", handleLobbyUpdated)
    socket.on("lobby_deleted", handleLobbyDeleted)
    socket.on("navigate_to_game", handleNavigate)

    return () => {
      socket.off("lobby_created", handleLobbyCreated)
      socket.off("lobby_updated", handleLobbyUpdated)
      socket.off("lobby_deleted", handleLobbyDeleted)
      socket.off("navigate_to_game", handleNavigate)
    }
  }, [socket, navigate])

  const handleCreateLobby = async (data: Partial<Lobby>) => {
    try {
      const newLobby = await createLobby(data)
      if (socket && newLobby) {
        socket.emit("join_game_room", newLobby.id)
      }
    } catch {}
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    )

  return (
    <>
      <CssBaseline />
      <InvitePlayerDialog
        open={isInviteModalOpen}
        onClose={closeInviteModal}
        lobby={invitingLobby}
        game={games.find((g) => g.id === invitingLobby?.gameId) || null}
      />

      <HeaderBar
        username={user.username}
        notifCount={0}
        onAvatarClick={(e) => setMenuAnchor(e.currentTarget)}
        getInitials={(name) =>
          name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        }
      />

      <AvatarMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onProfile={() => {
          setProfileOpen(true)
          setMenuAnchor(null)
        }}
        onLogout={handleLogout}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        username={user.username}
        memberSince="Mayıs 2025"
        getInitials={(name) =>
          name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        }
      />

      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={1000}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <Box
                component="img"
                src="/banner.png"
                alt="Game Center"
                sx={{
                  maxWidth: "70rem",
                  height: "35rem",
                  borderRadius: 3,
                  boxShadow: theme.shadows[8],
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Box textAlign="center" py={8}>
                  <Typography color="error" variant="h6">
                    {error}
                  </Typography>
                </Box>
              ) : (
                <Fade in timeout={1200}>
                  <Box>
                    <GamesGrid games={games} />
                  </Box>
                </Fade>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Fade in timeout={1400}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  height: "fit-content",
                  position: "sticky",
                  top: 24,
                }}
              >
                <LobbySidebar
                  games={games}
                  lobbies={lobbies}
                  onCreateLobby={handleCreateLobby}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                  onInvite={handleInvite}
                  onStartGame={handleStartGame}
                  canCreateLobby={canCreateLobby}
                />
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
