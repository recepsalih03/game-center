import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
} from "@mui/material";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GamesGrid from "../components/GamesGrid";
import LobbySidebar from "../components/LobbySidebar";

import type { GameCardProps } from "../components/GameCard";
import type { LobbyItem } from "../components/LobbyList";

import api from "../api/axios";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9100" },
    background: { default: "#fafafa", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
});

const getUserInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function HomePage() {
  const [username] = useState("John Doe");
  const [email] = useState("john.doe@example.com");
  const [memberSince] = useState("Jan 2024");

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [games, setGames] = useState<GameCardProps[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const [lobbies, setLobbies] = useState<LobbyItem[]>([]);
  const [lobbiesLoading, setLobbiesLoading] = useState(true);
  const [lobbiesError, setLobbiesError] = useState<string | null>(null);

  const [newLobbyName, setNewLobbyName] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState(4);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    async function fetchGames() {
      setGamesLoading(true);
      setGamesError(null);
      try {
        const res = await api.get<GameCardProps[]>("/games");
        setGames(res.data);
        setGamesLoading(false);
      } catch (err: any) {
        setGamesError("Oyunlar yüklenirken hata oluştu.");
        setGamesLoading(false);
      }
    }
    fetchGames();
  }, []);

  useEffect(() => {
    async function fetchLobbies() {
      setLobbiesLoading(true);
      setLobbiesError(null);
      try {
        const queryParam = selectedGame ? `?gameId=${selectedGame}` : "";
        const res = await api.get<LobbyItem[]>(`/lobbies${queryParam}`);
        setLobbies(res.data);
        setLobbiesLoading(false);
      } catch (err: any) {
        setLobbiesError("Lobby listesi yüklenirken hata oluştu.");
        setLobbiesLoading(false);
      }
    }
    fetchLobbies();
  }, [selectedGame]);

  const handleCreateLobby = async () => {
    if (!newLobbyName || !selectedGame) {
      alert("Önce lobi adı ve oyun seçimi yapın.");
      return;
    }
    try {
      await api.post("/lobbies", {
        name: newLobbyName,
        gameId: Number(selectedGame),
        maxPlayers,
      });
      const res = await api.get<LobbyItem[]>(`/lobbies?gameId=${selectedGame}`);
      setLobbies(res.data);
      setNewLobbyName("");
      setSelectedGame("");
      setMaxPlayers(4);
    } catch (err: any) {
      alert(err.response?.data?.error || "Lobby oluşturulurken hata oluştu.");
    }
  };

  const handleJoinLobby = async (lobbyId: string) => {
    try {
      await api.put(`/lobbies/${lobbyId}/join`);
      const res = await api.get<LobbyItem[]>(`/lobbies?gameId=${selectedGame}`);
      setLobbies(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Lobby’ye katılırken hata oluştu.");
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <HeaderBar
        username={username}
        notifCount={4}
        onAvatarClick={(e) => setMenuAnchor(e.currentTarget)}
        getInitials={getUserInitials}
      />

      <AvatarMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onProfile={() => {
          setMenuAnchor(null);
          setProfileOpen(true);
        }}
        onLogout={() => {
          setMenuAnchor(null);
          handleLogout();
        }}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        username={username}
        email={email}
        memberSince={memberSince}
        getInitials={getUserInitials}
      />

      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {gamesLoading ? (
            <CircularProgress />
          ) : gamesError ? (
            <Alert severity="error">{gamesError}</Alert>
          ) : (
            <Box display="flex" gap={3} flexWrap={{ xs: "wrap", md: "nowrap" }}>
              <Box flexGrow={1}>
                <GamesGrid games={games} />
              </Box>

              <Box width={{ xs: "100%", md: 380 }}>
                <LobbySidebar
                  games={games}
                  lobbies={lobbies}
                  formState={{
                    newLobbyName,
                    setNewLobbyName,
                    selectedGame,
                    setSelectedGame,
                    maxPlayers,
                    setMaxPlayers,
                    onCreate: handleCreateLobby,
                  }}
                  onJoin={handleJoinLobby}
                />

                {lobbiesLoading && <CircularProgress size={24} />}
                {lobbiesError && <Alert severity="error">{lobbiesError}</Alert>}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}