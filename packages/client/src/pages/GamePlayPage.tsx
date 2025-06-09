import React, { useState, useEffect, useContext } from "react";
import {
  Box, Container, CssBaseline, Typography, CircularProgress
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { TombalaBoard } from "game-tombala";
import { useSocket } from "../contexts/SocketContext";
import { AuthContext } from "../contexts/AuthContext";
import { Game, getGameById } from "../services/gamesService";
import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";

export default function GamePlayPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const location = useLocation();
  const socket = useSocket();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState(false);
  
  const lobbyId = location.state?.lobbyId;

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      setError("Oyun ID'si bulunamadı.");
      return;
    }
    getGameById(gameId)
      .then(setGame)
      .catch(() => setError("Oyun bilgileri yüklenemedi."))
      .finally(() => setLoading(false));
  }, [gameId]);

  const handleLogout = () => { if (logout) logout(); navigate("/"); };
  const initials = (name: string) => name.split(" ").map((x) => x[0]).join("").toUpperCase();

  const renderGameComponent = () => {
    if (!game) return null;
    if (!lobbyId) return <Typography>Lobi bilgisi olmadan oyun başlatılamaz.</Typography>

    switch (game.gameComponent) {
      case "TombalaBoard":
        return <TombalaBoard socket={socket} lobbyId={lobbyId} username={user ? user.username : null} />;
      default:
        return <Typography>Bu oyun bileşeni henüz desteklenmiyor.</Typography>;
    }
  };

  if (loading || !user) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!game) return <Typography>Oyun bulunamadı.</Typography>;

  return (
    <>
      <CssBaseline />
      <HeaderBar username={user.username} notifCount={0} onAvatarClick={(e) => setAnchor(e.currentTarget)} getInitials={initials} />
      <AvatarMenu anchorEl={anchor} onClose={() => setAnchor(null)} onProfile={() => setProfile(true)} onLogout={handleLogout} />
      <ProfileDialog open={profile} onClose={() => setProfile(false)} username={user.username} email={`${user.username}@example.com`} memberSince="Jan 2025" getInitials={initials} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {renderGameComponent()}
      </Container>
    </>
  );
}