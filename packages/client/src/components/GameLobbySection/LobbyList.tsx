import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Stack, Tooltip } from "@mui/material";
import { PersonAdd, Login, PlayArrow, Logout } from '@mui/icons-material';
import type { Lobby } from "../../services/lobbiesService";
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';

interface Props {
  lobbies: Lobby[];
  onJoin: (lobbyId: string) => void;
  onLeave: (lobbyId: string) => void;
  onInvite: (lobby: Lobby) => void;
  onStartGame: (lobbyId: string) => void;
}

const LobbyList: React.FC<Props> = ({ lobbies, onJoin, onLeave, onInvite, onStartGame }) => {
  const { user } = useContext(AuthContext);
  const isUserInLobby = (lobby: Lobby) => lobby.playerUsernames.includes(user?.username || '');
  const isUserHost = (lobby: Lobby) => lobby.playerUsernames[0] === user?.username;

  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Typography variant="h6" gutterBottom>Aktif Lobiler</Typography>
      <List>
        {lobbies.length === 0 && <Typography>Henüz lobi yok.</Typography>}
        {lobbies.map(l => (
          <ListItem key={l.id} divider secondaryAction={
            <Stack direction="row" spacing={0.5}>
              {isUserHost(l) && l.status === 'open' && (
                 <Tooltip title="Oyunu Başlat">
                    <IconButton edge="end" color="warning" onClick={() => onStartGame(l.id)}><PlayArrow /></IconButton>
                 </Tooltip>
              )}
              {isUserInLobby(l) && (
                <Tooltip title="Davet Et">
                  <IconButton edge="end" color="primary" onClick={() => onInvite(l)}><PersonAdd /></IconButton>
                </Tooltip>
              )}
              {isUserInLobby(l) ? (
                 <Tooltip title="Lobiden Ayrıl">
                  <IconButton edge="end" color="error" onClick={() => onLeave(l.id)}><Logout /></IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Katıl">
                  <span>
                    <IconButton edge="end" color="success" onClick={() => onJoin(l.id)} disabled={l.status !== "open"}><Login /></IconButton>
                  </span>
                </Tooltip>
              )}
            </Stack>
          }>
            <ListItemText 
              primary={l.name} 
              secondary={`${l.players} / ${l.maxPlayers} Oyuncu - Kurucu: ${l.playerUsernames[0]}`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyList;