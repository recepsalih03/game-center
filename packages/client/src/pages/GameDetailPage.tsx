"use client"

import { useState, useEffect, useContext } from "react"

import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Fade,
  useTheme,
  alpha,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material"

import { PlayArrow, People, Info, EmojiEvents, MenuBook } from "@mui/icons-material"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { type Game, getGameById } from "../services/gamesService"
import { type Lobby, getAllLobbies, createLobby } from "../services/lobbiesService"
import HeaderBar from "../components/HeaderBar"
import AvatarMenu from "../components/AvatarMenu"
import ProfileDialog from "../components/ProfileDialog"
import HowToPlay from "../components/HowtoPlay"
import PlayerStatsModal from "../components/PlayerStatsModal"

export default function GameDetailPage() {
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const [game, setGame] = useState<Game | null>(null)
  const [lobbies, setLobbies] = useState<Lobby[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [gameData, lobbiesData] = await Promise.all([getGameById(id), getAllLobbies()])
        setGame(gameData)
        setLobbies(lobbiesData.filter((l) => l.gameId === Number.parseInt(id)))
      } catch (err) {
        setError("Oyun bilgileri yüklenemedi.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handlePlayNow = () => {
    navigate(`/play/${id}`, { state: { solo: true } });
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const isTombalaGame = game?.title?.toLowerCase().includes("tombala")

  if (!user) return <CircularProgress />

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !game) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h6">
          {error || "Oyun bulunamadı"}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <CssBaseline />
      <HeaderBar
        username={user.username}
        notifCount={0}
        onAvatarClick={(e) => setMenuAnchor(e.currentTarget)}
        getInitials={getInitials}
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
        getInitials={getInitials}
      />

      {isTombalaGame && <PlayerStatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />}

      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  elevation={8}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={game.imageUrl}
                    alt={game.title}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Chip label="Popüler Oyun" color="primary" icon={<EmojiEvents />} />
                    {isTombalaGame && (
                      <Tooltip title="Oyuncu İstatistikleri">
                        <IconButton
                          onClick={() => setStatsOpen(true)}
                          sx={{
                            background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.2)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                            "&:hover": {
                              background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.light, 0.3)} 100%)`,
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <MenuBook color="secondary" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
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
                  <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.6 }}>
                    {game.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Chip icon={<People />} label={`${lobbies.length} Aktif Lobi`} variant="outlined" />
                    <Chip icon={<Info />} label="Kolay Öğrenilir" variant="outlined" />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={handlePlayNow}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[8],
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    OYNA
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Fade in timeout={1200}>
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
                <HowToPlay
                  steps={game.howToPlaySteps}
                  videoLinks={[
                    { label: "Nasıl Oynanır?", url: "#" },
                    { label: "İpuçları", url: "#" },
                  ]}
                />
              </Paper>
            </Fade>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Fade in timeout={1400}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  height: "fit-content",
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Aktif Lobiler
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {lobbies.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={3}>
                    Henüz aktif lobi yok
                  </Typography>
                ) : (
                  <Box>
                    {lobbies.slice(0, 5).map((lobby) => (
                      <Card
                        key={lobby.id}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          "&:hover": {
                            boxShadow: theme.shadows[4],
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {lobby.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lobby.players}/{lobby.maxPlayers} oyuncu
                          </Typography>
                          <Chip
                            label={lobby.status === "open" ? "Açık" : "Dolu"}
                            size="small"
                            color={lobby.status === "open" ? "success" : "default"}
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
