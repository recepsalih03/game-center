import React from "react"
import { Paper, Typography, List, ListItem, ListItemText, Button } from "@mui/material"
import type { Lobby } from "../../lib/dummy-data"

interface Props { lobbies: Lobby[] }
const LobbyList:React.FC<Props>=({ lobbies })=>(
  <Paper sx={{ p:3 }} elevation={2}>
    <Typography variant="h6" gutterBottom>Available Lobbies</Typography>
    <List>
      {lobbies.length===0 && <Typography>No lobbies yet.</Typography>}
      {lobbies.map(l=>(
        <ListItem key={l.id} divider
          secondaryAction={
            <Button variant="outlined" size="small" disabled={l.status==="full"}>
              {l.status==="full"?"Full":"Join"}
            </Button>
          }>
          <ListItemText primary={l.name} secondary={`${l.players}/${l.maxPlayers} players`} />
        </ListItem>
      ))}
    </List>
  </Paper>
)
export default LobbyList