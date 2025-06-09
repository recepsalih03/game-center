import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { joinLobby } from '../services/lobbiesService';

interface InviteNotificationProps {
  fromUser: string;
  lobbyName: string;
  lobbyId: string;
  gameTitle: string;
  closeToast?: () => void;
}

const InviteNotification: React.FC<InviteNotificationProps> = ({ fromUser, lobbyName, lobbyId, gameTitle, closeToast }) => {

  const handleJoinClick = async () => {
    try {
      await joinLobby(lobbyId);
      toast.success(`"${lobbyName}" lobisine katıldınız!`);
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