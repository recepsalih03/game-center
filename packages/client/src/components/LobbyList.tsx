import React from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";

export interface LobbyItem {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  gameId: number;
  status: "open" | "full" | "in-progress";
}

interface Props {
  lobbies: LobbyItem[];
  onJoin: (id: string) => void;
}

export default function LobbyList({ lobbies, onJoin }: Props) {
  return (
    <List>
      {lobbies.length === 0 && (
        <ListItem>
          <ListItemText primary="No lobbies yet." />
        </ListItem>
      )}
      {lobbies.map((l) => (
        <ListItem
          key={l.id}
          sx={{ mb: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
          secondaryAction={
            <Button
              variant="outlined"
              size="small"
              disabled={l.status === "full"}
              onClick={() => onJoin(l.id)}
            >
              {l.status === "full" ? "Full" : "Join"}
            </Button>
          }
        >
          <ListItemText
            primary={l.name}
            secondary={`${l.players} / ${l.maxPlayers} players`}
          />
        </ListItem>
      ))}
    </List>
  );
}