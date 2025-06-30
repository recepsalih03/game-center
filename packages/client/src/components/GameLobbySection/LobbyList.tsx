import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  PersonAdd,
  Login,
  PlayArrow,
  Logout,
  Lock,
  Share,
} from "@mui/icons-material";
import { AuthContext } from "../../contexts/AuthContext";
import { Lobby } from "../../services/lobbiesService";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

interface Props {
  lobbies: Lobby[];
  onJoin: (lobbyId: string, gameId: number, password?: string) => void;
  onLeave: (lobbyId: string) => void;
  onInvite: (lobby: Lobby) => void;
  onStartGame: (lobbyId: string) => void;
}

export default function LobbyList({
  lobbies,
  onJoin,
  onLeave,
  onInvite,
  onStartGame,
}: Props) {
  const { user } = useContext(AuthContext);
  const [now, setNow] = useState(dayjs());
  const [triggered, setTriggered] = useState<Set<string>>(new Set());

  // Zaman ve otomatik start
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    lobbies.forEach(l => {
      if (
        l.lobbyType === "event" &&
        now.isAfter(dayjs(l.eventStartsAt)) &&
        !triggered.has(l.id)
      ) {
        onStartGame(l.id);
        setTriggered(prev => new Set(prev).add(l.id));
      }
    });
  }, [now, lobbies, onStartGame, triggered]);

  const isUserInLobby = (l: Lobby) =>
    l.playerUsernames.includes(user?.username || "");
  const isUserHost = (l: Lobby) => l.playerUsernames[0] === user?.username;

  const handleJoinClick = (l: Lobby) => {
    if (l.password) {
      const pass = prompt("Lütfen lobi şifresini girin:");
      if (pass !== null) {
        onJoin(l.id, l.gameId, pass);
      }
    } else {
      onJoin(l.id, l.gameId);
    }
  };

  const sorted = lobbies
    .filter(l =>
      l.lobbyType === "event" ? dayjs(l.eventEndsAt).isAfter(now) : true
    )
    .sort((a, b) => {
      if (a.lobbyType === "event" && b.lobbyType !== "event") return -1;
      if (b.lobbyType === "event" && a.lobbyType !== "event") return 1;
      if (a.lobbyType === "event" && b.lobbyType === "event") {
        return dayjs(a.eventStartsAt).isBefore(dayjs(b.eventStartsAt))
          ? -1
          : 1;
      }
      return 0;
    });

  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Aktif Lobiler
      </Typography>
      <List sx={{ p: 0 }}>
        {sorted.length === 0 && (
          <Typography sx={{ p: 2 }}>Henüz lobi yok.</Typography>
        )}
        {sorted.map(l => {
          let subtitle = `${l.players} / ${l.maxPlayers} oyuncu`;
          if (l.lobbyType === "event") {
            const start = dayjs(l.eventStartsAt);
            const diff = start.diff(now);
            if (diff > 24 * 3600 * 1000) {
              subtitle += ` • Başlangıç: ${start.format("DD.MM.YYYY HH:mm")}`;
            } else if (diff > 0) {
              const rem = dayjs.duration(diff);
              subtitle += ` • Başlayana Kalan: ${rem.hours()}h ${rem.minutes()}m ${rem.seconds()}s`;
            } else {
              subtitle += ` • Başlıyor...`;
            }
          }

          return (
            <React.Fragment key={l.id}>
              <ListItem>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {l.password && <Lock color="action" />}
                    <ListItemText primary={l.name} secondary={subtitle} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {isUserHost(l) && l.status !== "in-progress" && (
                      <Tooltip title="Oyunu Başlat">
                        <IconButton
                          color="warning"
                          onClick={() => onStartGame(l.id)}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    )}
                    {isUserInLobby(l) ? (
                      <Tooltip title="Lobiden Ayrıl">
                        <IconButton
                          color="error"
                          onClick={() => onLeave(l.id)}
                        >
                          <Logout />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Katıl">
                        <IconButton
                          color="success"
                          onClick={() => handleJoinClick(l)}
                          disabled={l.status !== "open"}
                        >
                          <Login />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Davet Et">
                      <IconButton
                        color="primary"
                        onClick={() => onInvite(l)}
                      >
                        <PersonAdd />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Paylaş">
                      <IconButton
                        color="info"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/lobby/${l.id}`
                          );
                          toast.success("Lobi linki kopyalandı!");
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
}