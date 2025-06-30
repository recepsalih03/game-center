import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { joinLobby } from '../services/lobbiesService';
import { useSocket } from '../contexts/SocketContext';

interface InviteNotificationProps {
  fromUser: string;
  lobbyName: string;
  lobbyId: string;
  gameTitle: string;
  gameId: number;
  closeToast?: () => void;
}

export default function InviteNotification({
  fromUser,
  lobbyName,
  lobbyId,
  gameTitle,
  gameId,
  closeToast,
}: InviteNotificationProps) {
  const navigate = useNavigate();
  const socket = useSocket();

  const handleJoinClick = async () => {
    try {
      const pass = prompt("Bu lobi şifreli. Lütfen şifreyi girin:");
      if (pass === null) {
        closeToast?.();
        return;
      }

      await joinLobby(lobbyId, pass);
      socket?.emit('join_game_room', lobbyId);

      toast.success(`"${lobbyName}" lobisine katıldınız!`);
      navigate(`/game/1`, { state: { autoJoinLobbyId: lobbyId } });
    } catch (error: any) {
      const msg = error.response?.data?.error || "Lobiye katılırken bir hata oluştu.";
      toast.error(msg);
      console.error(error);
    } finally {
      closeToast?.();
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>{fromUser}</strong> sizi <strong>"{lobbyName}"</strong> ({gameTitle}) lobisine davet ediyor!
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={handleJoinClick}
        sx={{ width: '100%' }}
      >
        Daveti Kabul Et ve Katıl
      </Button>
    </Box>
  );
}