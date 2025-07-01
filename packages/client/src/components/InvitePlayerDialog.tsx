"use client"

import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { Send, PersonAdd, Close } from "@mui/icons-material"
import { useSocket } from "../contexts/SocketContext"
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import type { Game } from "../services/gamesService"
import type { Lobby } from "../services/lobbiesService"
import { toast } from "react-toastify"

interface Props {
  open: boolean
  onClose: () => void
  lobby: Lobby | null
  game: Game | null
}

export default function InvitePlayerDialog({ open, onClose, lobby, game }: Props) {
  const theme = useTheme()
  const [toUser, setToUser] = useState("")
  const socket = useSocket()
  const { user } = useContext(AuthContext)

  const handleSendInvite = () => {
    if (!toUser || !lobby || !game || !socket || !user) {
      toast.error("Davet göndermek için tüm bilgiler eksiksiz olmalı.")
      return
    }

    socket.emit("send_invite", {
      fromUser: user.username,
      toUser: toUser,
      lobbyId: lobby.id,
      lobbyName: lobby.name,
      gameTitle: game.title,
    })

    toast.success(`${toUser} kullanıcısına davet gönderildi!`)
    setToUser("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <PersonAdd color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Oyuncu Davet Et
        </Typography>
        <Button onClick={onClose} size="small" sx={{ minWidth: "auto", p: 1 }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Fade in={open} timeout={600}>
          <Box>
            {/* Lobby Info */}
            {lobby && game && (
              <Card
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {lobby.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.title} • {lobby.players}/{lobby.maxPlayers} oyuncu
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Davet etmek istediğiniz oyuncunun kullanıcı adını girin.
            </Typography>

            <TextField
              autoFocus
              fullWidth
              label="Kullanıcı Adı"
              variant="outlined"
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendInvite()
                }
              }}
            />
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          İptal
        </Button>
        <Button
          onClick={handleSendInvite}
          variant="contained"
          startIcon={<Send />}
          disabled={!toUser.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Davet Gönder
        </Button>
      </DialogActions>
    </Dialog>
  )
}
