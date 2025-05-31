"use client"
import React from "react"
import { List, ListItem, ListItemText, Button } from "@mui/material"

export interface LobbyItem {
  id: number; name: string; players: number; maxPlayers: number; game: string; status: "open"|"full"|"in-progress";
}

interface Props { lobbies: LobbyItem[] }

export default function LobbyList({ lobbies }: Props) {
  return (
    <List>
      {lobbies.map((l)=>(
        <ListItem key={l.id}
          sx={{ mb:1, border:1, borderColor:"divider", borderRadius:1 }}
          secondaryAction={
            <Button variant="outlined" size="small" disabled={l.status==="full"}>
              {l.status==="full" ? "Full" : "Join"}
            </Button>
          }>
          <ListItemText
            primary={l.name}
            secondary={`${l.game} — ${l.players}/${l.maxPlayers} players`}
          />
        </ListItem>
      ))}
    </List>
  )
}