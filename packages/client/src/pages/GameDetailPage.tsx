import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Grid,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GameOverview from "../components/GameOverview";
import HowToPlay from "../components/HowtoPlay";
import GameSettings from "../components/GameSettings";
import GameHistory from "../components/GameHistory";
import LobbyForm from "../components/GameLobbySection/LobbyForm";
import LobbyList from "../components/GameLobbySection/LobbyList";
import { Game, getGameById } from "../services/gamesService";
import { Lobby, getLobbiesByGameId, createLobby } from "../services/lobbiesService";

const lightTheme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" }, secondary: { main: "#ff9800" } },
});

const TabPanel: React.FC<{ index: number; value: number; children: React.ReactNode }> = ({
  index, value, children,
}) => (index === value ? <Box pt={2}>{children}</Box> : null);

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const socket = useSocket();

  const [game, setGame] = useState<Game | null>(null);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState(false);
  const [tab, setTab] = useState(0);

  const fetchGameData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const gameData = await getGameById(id);
      const lobbiesData = await getLobbiesByGameId(id);
      setGame(gameData);
      setLobbies(lobbiesData);
      setError(null);
    } catch (err) {
      setError("Oyun verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  useEffect(() => {
    if (!socket || !id) return;
    const handleLobbyCreated = (newLobby: Lobby) => {
      if (newLobby.gameId === Number(id)) setLobbies((prev) => [...prev, newLobby]);
    };
    const handleLobbyUpdated = (updatedLobby: Lobby) => {
      setLobbies((prev) => prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)));
    };
    const handleLobbyDeleted = (data: { id: string }) => {
      setLobbies((prev) => prev.filter((l) => l.id !== data.id));
    };
    socket.on('lobby_created', handleLobbyCreated);
    socket.on('lobby_updated', handleLobbyUpdated);
    socket.on('lobby_deleted', handleLobbyDeleted);
    return () => {
      socket.off('lobby_created', handleLobbyCreated);
      socket.off('lobby_updated', handleLobbyUpdated);
      socket.off('lobby_deleted', handleLobbyDeleted);
    };
  }, [socket, id]);

  const handleCreateLobby = async (name: string, maxPlayers: number) => {
    if (!game) return;
    try {
      await createLobby(name, game.id, maxPlayers);
    } catch (err) {
      alert("Lobi oluşturulurken bir hata oluştu.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <CircularProgress />;
  }
  
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;
  if (!game) return <Container><Typography>Oyun bulunamadı.</Typography></Container>;

  const initials = (name: string) => name.split(" ").map((x) => x[0]).join("").toUpperCase();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <HeaderBar
        username={user.username}
        notifCount={0}
        onAvatarClick={(e) => setAnchor(e.currentTarget)}
        getInitials={initials}
      />
      <AvatarMenu
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        onProfile={() => { setProfile(true); setAnchor(null); }}
        onLogout={handleLogout}
      />
      <ProfileDialog
        open={profile}
        onClose={() => setProfile(false)}
        username={user.username}
        email={`${user.username}@example.com`}
        memberSince="Jan 2025"
        getInitials={initials}
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
          {["Genel Bakış", "Lobiler", "Geçmiş", "Nasıl Oynanır", "Ayarlar"].map((lbl, i) => (
            <Tab key={i} label={lbl} />
          ))}
        </Tabs>
        <TabPanel index={0} value={tab}>
          <GameOverview game={game} />
          <Box mt={3}>
            <Button variant="contained" size="large" onClick={() => navigate(`/play/${game.id}`)}>
              Oyunu Başlat
            </Button>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tab}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <LobbyForm onCreate={handleCreateLobby} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <LobbyList lobbies={lobbies} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel index={2} value={tab}>
          <GameHistory history={[]} />
        </TabPanel>
        <TabPanel index={3} value={tab}>
          <HowToPlay steps={["WASD ile hareket et", "Mouse ile nişan al", "SPACE ile zıpla"]} />
        </TabPanel>
        <TabPanel index={4} value={tab}>
          <GameSettings onSave={(s) => console.log("Ayarlar kaydedildi", s)} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}