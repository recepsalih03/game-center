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

const InviteNotification: React.FC<InviteNotificationProps> = ({ fromUser, lobbyName, lobbyId, gameTitle, gameId, closeToast }) => {
  const navigate = useNavigate();
  const socket = useSocket();

  const handleJoinClick = async () => {
    try {
      await joinLobby(lobbyId);
      if (socket) {
        socket.emit('join_game_room', lobbyId);
      }
      toast.success(`"${lobbyName}" lobisine katıldınız!`);
      navigate(`/game/1`);
    } catch (error) {
      toast.error("Lobiye katılırken bir hata oluştu.");
      console.error(error);
    }
    if(closeToast) closeToast();
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
};

export default InviteNotification;