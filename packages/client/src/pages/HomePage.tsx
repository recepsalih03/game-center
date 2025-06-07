import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Game, getGames } from "../services/gamesService";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GamesGrid from "../components/GamesGrid";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
    background: { default: "#fafafa", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
});

const getUserInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const gamesData = await getGames();
        setGames(gamesData);
        setError(null);
      } catch (err) {
        setError("Oyunlar yüklenemedi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <HeaderBar
        username={user.username}
        notifCount={0}
        onAvatarClick={(e) => setMenuAnchor(e.currentTarget)}
        getInitials={getUserInitials}
      />
      <AvatarMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onProfile={() => { setProfileOpen(true); setMenuAnchor(null); }}
        onLogout={handleLogout}
      />
      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        username={user.username}
        email={`${user.username}@example.com`}
        memberSince="Jan 2025"
        getInitials={getUserInitials}
      />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" textAlign="center">{error}</Typography>
        ) : (
          <GamesGrid games={games} />
        )}
      </Container>
    </ThemeProvider>
  );
}