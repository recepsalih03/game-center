import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  winner: string;
}

export default function GameOverDialog({ open, winner }: Props) {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Oyun Bitti!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tebrikler! Oyunu kazanan:
        </DialogContentText>
        <Typography variant="h4" color="primary" sx={{ textAlign: 'center', mt: 2 }}>
          {winner}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGoToHome} autoFocus>
          Anasayfaya Dön
        </Button>
      </DialogActions>
    </Dialog>
  );
}