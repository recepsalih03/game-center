"use client"

import { useContext, useEffect, useState } from "react"
import {
  Typography,
  List,
  IconButton,
  Tooltip,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { PersonAdd, Login, PlayArrow, Logout, Lock, Share, Schedule, People } from "@mui/icons-material"
import { AuthContext } from "../../contexts/AuthContext"
import type { Lobby } from "../../services/lobbiesService"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

interface Props {
  lobbies: Lobby[]
  onJoin: (lobbyId: string, gameId: number, password?: string) => void
  onLeave: (lobbyId: string) => void
  onInvite: (lobby: Lobby) => void
  onStartGame: (lobbyId: string) => void
}

export default function LobbyList({ lobbies, onJoin, onLeave, onInvite, onStartGame }: Props) {
  const theme = useTheme()
  const { user } = useContext(AuthContext)
  const [now, setNow] = useState(dayjs())
  const [triggered, setTriggered] = useState<Set<string>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    lobbies.forEach((l) => {
      if (l.lobbyType === "event" && now.isAfter(dayjs(l.eventStartsAt)) && !triggered.has(l.id)) {
        onStartGame(l.id)
        setTriggered((prev) => new Set(prev).add(l.id))
      }
    })
  }, [now, lobbies, onStartGame, triggered])

  const isUserInLobby = (l: Lobby) => l.playerUsernames.includes(user?.username || "")

  const isUserHost = (l: Lobby) => l.playerUsernames[0] === user?.username

  const handleJoinClick = (l: Lobby) => {
    if (l.password) {
      const pass = prompt("Lütfen lobi şifresini girin:")
      if (pass !== null) {
        onJoin(l.id, l.gameId, pass)
      }
    } else {
      onJoin(l.id, l.gameId)
    }
  }

  const sorted = lobbies
    .filter((l) => (l.lobbyType === "event" ? dayjs(l.eventEndsAt).isAfter(now) : true))
    .sort((a, b) => {
      if (a.lobbyType === "event" && b.lobbyType !== "event") return -1
      if (b.lobbyType === "event" && a.lobbyType !== "event") return 1
      if (a.lobbyType === "event" && b.lobbyType === "event") {
        return dayjs(a.eventStartsAt).isBefore(dayjs(b.eventStartsAt)) ? -1 : 1
      }
      return 0
    })

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <People color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Aktif Lobiler
        </Typography>
        <Chip label={sorted.length} size="small" color="primary" sx={{ ml: "auto" }} />
      </Box>

      {sorted.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.5),
            border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <People sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3), mb: 1 }} />
            <Typography color="text.secondary">Henüz lobi yok</Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {sorted.map((lobby, index) => {
            const start = dayjs(lobby.eventStartsAt)
            const diff = start.diff(now)

            let timeInfo = null
            if (lobby.lobbyType === "event") {
              if (diff > 24 * 3600 * 1000) {
                timeInfo = start.format("DD.MM.YYYY HH:mm")
              } else if (diff > 0) {
                const rem = dayjs.duration(diff)
                timeInfo = `${rem.hours()}h ${rem.minutes()}m ${rem.seconds()}s`
              } else {
                timeInfo = "Başlıyor..."
              }
            }

            return (
              <Fade key={lobby.id} in timeout={600 + index * 100}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          {lobby.password && <Lock sx={{ fontSize: 16, color: "text.secondary" }} />}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {lobby.name}
                          </Typography>
                          {lobby.lobbyType === "event" && (
                            <Chip label="Event" size="small" color="secondary" icon={<Schedule />} />
                          )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <People sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {lobby.players}/{lobby.maxPlayers}
                            </Typography>
                          </Box>

                          <Chip
                            label={lobby.status === "open" ? "Açık" : lobby.status === "full" ? "Dolu" : "Oyunda"}
                            size="small"
                            color={lobby.status === "open" ? "success" : lobby.status === "full" ? "warning" : "error"}
                            variant="outlined"
                          />
                        </Box>

                        {timeInfo && (
                          <Typography variant="caption" color="text.secondary">
                            {diff > 0 ? `Başlayana: ${timeInfo}` : timeInfo}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                        {lobby.playerUsernames.slice(0, 3).map((username, idx) => (
                          <Avatar
                            key={username}
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: "0.7rem",
                              bgcolor: isUserHost(lobby) && idx === 0 ? "primary.main" : "secondary.main",
                            }}
                          >
                            {username.charAt(0).toUpperCase()}
                          </Avatar>
                        ))}
                        {lobby.playerUsernames.length > 3 && (
                          <Avatar sx={{ width: 24, height: 24, fontSize: "0.6rem", bgcolor: "grey.400" }}>
                            +{lobby.playerUsernames.length - 3}
                          </Avatar>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      {isUserHost(lobby) && lobby.status !== "in-progress" && (
                        <Tooltip title="Oyunu Başlat">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onStartGame(lobby.id)}
                            sx={{
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              "&:hover": {
                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                              },
                            }}
                          >
                            <PlayArrow fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {isUserInLobby(lobby) ? (
                        <Tooltip title="Lobiden Ayrıl">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onLeave(lobby.id)}
                            sx={{
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                              },
                            }}
                          >
                            <Logout fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Katıl">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleJoinClick(lobby)}
                            disabled={lobby.status !== "open"}
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              "&:hover": {
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                              },
                            }}
                          >
                            <Login fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Davet Et">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onInvite(lobby)}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <PersonAdd fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Paylaş">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/lobby/${lobby.id}`)
                            toast.success("Lobi linki kopyalandı!")
                          }}
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                            },
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            )
          })}
        </List>
      )}
    </Box>
  )
}
