import React, { useContext } from "react";
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Stack, Tooltip, Box, Divider, Grid } from "@mui/material";
import { PersonAdd, Login, PlayArrow, Logout, Lock, Share } from '@mui/icons-material';
import type { Lobby } from "../../services/lobbiesService";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from "react-toastify";

interface Props {
  lobbies: Lobby[];
  onJoin: (lobbyId: string, gameId: number, password?: string) => void;
  onLeave: (lobbyId: string) => void;
  onInvite: (lobby: Lobby) => void;
  onStartGame: (lobbyId: string) => void;
}

const LobbyList: React.FC<Props> = ({ lobbies, onJoin, onLeave, onInvite, onStartGame }) => {
  const { user } = useContext(AuthContext);
  const isUserInLobby = (lobby: Lobby) => lobby.playerUsernames.includes(user?.username || '');
  const isUserHost = (lobby: Lobby) => lobby.playerUsernames[0] === user?.username;

  const handleShare = (lobbyId: string) => {
    const link = `${window.location.origin}/lobby/${lobbyId}`;
    navigator.clipboard.writeText(link);
    toast.success("Lobi davet linki panoya kopyalandı!");
  };

  const handleJoinClick = (lobby: Lobby) => {
    if (lobby.password) {
      const pass = prompt("Lütfen lobi şifresini girin:");
      if (pass !== null) {
        onJoin(lobby.id, lobby.gameId, pass);
      }
    } else {
      onJoin(lobby.id, lobby.gameId);
    }
  };

  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Typography variant="h6" gutterBottom>Aktif Lobiler</Typography>
      <List sx={{p:0}}>
        {lobbies.length === 0 && <Typography sx={{ p: 2 }}>Henüz lobi yok.</Typography>}
        {lobbies.map(l => (
          <React.Fragment key={l.id}>
            <ListItem>
              <Grid container alignItems="center">
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {l.password && <Lock fontSize="small" color="action" />}
                    <ListItemText 
                      primary={l.name} 
                      secondary={`${l.players} / ${l.maxPlayers} Oyuncu - Kurucu: ${l.playerUsernames[0]}`} 
                    />
                  </Stack>
                </Grid>
                <Grid size="auto">
                  <Stack direction="row" spacing={0.5}>
                    {isUserHost(l) && l.status !== 'in-progress' && (
                       <Tooltip title="Oyunu Başlat"><IconButton size="small" color="warning" onClick={() => onStartGame(l.id)}><PlayArrow /></IconButton></Tooltip>
                    )}
                    {isUserInLobby(l) ? (
                       <Tooltip title="Lobiden Ayrıl"><IconButton size="small" color="error" onClick={() => onLeave(l.id)}><Logout /></IconButton></Tooltip>
                    ) : (
                      <Tooltip title="Katıl"><span><IconButton size="small" color="success" onClick={() => handleJoinClick(l)} disabled={l.status !== "open"}><Login /></IconButton></span></Tooltip>
                    )}
                     <Tooltip title="Davet Et"><IconButton size="small" color="primary" onClick={() => onInvite(l)}><PersonAdd /></IconButton></Tooltip>
                     <Tooltip title="Paylaş"><IconButton size="small" color="info" onClick={() => handleShare(l.id)}><Share /></IconButton></Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyList;