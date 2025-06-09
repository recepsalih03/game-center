import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Stack, Tooltip, Box, Divider } from "@mui/material";
import { PersonAdd, Login, PlayArrow, Logout } from '@mui/icons-material';
import type { Lobby } from "../../services/lobbiesService";
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';

interface Props {
  lobbies: Lobby[];
  onJoin: (lobbyId: string, gameId: number) => void;
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
        {lobbies.length === 0 && <Typography sx={{ p: 2 }}>Henüz lobi yok.</Typography>}
        {lobbies.map(l => (
          <React.Fragment key={l.id}>
            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText 
                primary={l.name} 
                secondary={`${l.players} / ${l.maxPlayers} Oyuncu - Kurucu: ${l.playerUsernames[0]}`} 
                sx={{ width: '100%' }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1, width: '100%' }}>
                {isUserHost(l) && l.status !== 'in-progress' && (
                   <Tooltip title="Oyunu Başlat">
                      <IconButton size="small" color="warning" onClick={() => onStartGame(l.id)}><PlayArrow /></IconButton>
                   </Tooltip>
                )}
                {isUserInLobby(l) ? (
                   <Tooltip title="Lobiden Ayrıl">
                    <IconButton size="small" color="error" onClick={() => onLeave(l.id)}><Logout /></IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Katıl">
                    <span>
                      <IconButton size="small" color="success" onClick={() => onJoin(l.id, l.gameId)} disabled={l.status !== "open"}><Login /></IconButton>
                    </span>
                  </Tooltip>
                )}
                {isUserInLobby(l) && (
                  <Tooltip title="Davet Et">
                    <IconButton size="small" color="primary" onClick={() => onInvite(l)}><PersonAdd /></IconButton>
                  </Tooltip>
                )}
              </Stack>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyList;