import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { Game } from '../services/gamesService';
import { Lobby } from '../services/lobbiesService';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  lobby: Lobby | null;
  game: Game | null;
}

export default function InvitePlayerDialog({ open, onClose, lobby, game }: Props) {
  const [toUser, setToUser] = useState('');
  const socket = useSocket();
  const { user } = useContext(AuthContext);

  const handleSendInvite = () => {
    if (!toUser || !lobby || !game || !socket || !user) {
      toast.error("Davet göndermek için tüm bilgiler eksiksiz olmalı.");
      return;
    }
    socket.emit('send_invite', {
      fromUser: user.username,
      toUser: toUser,
      lobbyId: lobby.id,
      lobbyName: lobby.name,
      gameTitle: game.title,
    });
    toast.info(`${toUser} kullanıcısına davet gönderildi!`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Oyuncu Davet Et</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {lobby?.name} lobisine davet etmek istediğiniz oyuncunun kullanıcı adını girin.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Kullanıcı Adı"
          type="text"
          fullWidth
          variant="standard"
          value={toUser}
          onChange={(e) => setToUser(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSendInvite}>Davet Gönder</Button>
      </DialogActions>
    </Dialog>
  );
}