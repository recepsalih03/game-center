import React from "react"
import { Box, Typography, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { joinLobby } from "../services/lobbiesService"
import { useSocket } from "../contexts/SocketContext"

interface InviteNotificationProps {
  fromUser: string
  lobbyName: string
  lobbyId: string
  gameTitle: string
  gameId: number
  closeToast?: () => void
}

export default function InviteNotification({
  fromUser,
  lobbyName,
  lobbyId,
  gameTitle,
  gameId,
  closeToast,
}: InviteNotificationProps) {
  const navigate = useNavigate()
  const socket = useSocket()

  const join = async (password?: string) => {
    await joinLobby(lobbyId, password)
    socket?.emit("join_game_room", lobbyId)
    toast.success(`"${lobbyName}" lobisine katıldınız!`)
    navigate(`/game/1`, { state: { autoJoinLobbyId: lobbyId } })
  }

  const handleJoinClick = async () => {
    try {
      await join()
    } catch (err: any) {
      if (err.response?.status === 403) {
        const pass = prompt("Bu lobi şifreli. Lütfen şifreyi girin:")
        if (pass !== null) {
          try {
            await join(pass)
          } catch (e: any) {
            toast.error(e.response?.data?.error || "Lobiye katılamadınız.")
          }
        }
      } else {
        toast.error(err.response?.data?.error || "Lobiye katılamadınız.")
      }
    } finally {
      closeToast?.()
    }
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>{fromUser}</strong> sizi <strong>"{lobbyName}"</strong> ({gameTitle}) lobisine davet ediyor!
      </Typography>
      <Button variant="contained" size="small" onClick={handleJoinClick} sx={{ width: "100%" }}>
        Daveti Kabul Et ve Katıl
      </Button>
    </Box>
  )
}