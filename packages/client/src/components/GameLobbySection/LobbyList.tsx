import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Stack, Tooltip } from "@mui/material";
import { PersonAdd, Login } from '@mui/icons-material';
import type { Lobby } from "../../services/lobbiesService";
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';

interface Props {
  lobbies: Lobby[];
  onJoin: (lobbyId: string, gameId: number) => void;
  onInvite: (lobbyId: string, lobbyName: string) => void;
}

const LobbyList: React.FC<Props> = ({ lobbies, onJoin, onInvite }) => {
  const { user } = useContext(AuthContext);

  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Typography variant="h6" gutterBottom>Aktif Lobiler</Typography>
      <List>
        {lobbies.length === 0 && <Typography>Henüz lobi yok.</Typography>}
        {lobbies.map(l => (
          <ListItem key={l.id} divider secondaryAction={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Davet Et">
                <IconButton edge="end" color="primary" onClick={() => onInvite(l.id, l.name)}>
                  <PersonAdd />
                </IconButton>
              </Tooltip>
              <Tooltip title="Katıl">
                <span>
                  <IconButton edge="end" color="success" onClick={() => onJoin(l.id, l.gameId)} disabled={l.status === "full" || l.status === "in-progress" || l.playerUsernames.includes(user?.username || '')}>
                    <Login />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }>
            <ListItemText primary={l.name} secondary={`${l.players} / ${l.maxPlayers} oyuncu`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyList;