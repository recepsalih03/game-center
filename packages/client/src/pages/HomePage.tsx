import React, { useState, useEffect, useContext } from "react";
import {
  Box, Container, CssBaseline, CircularProgress, Typography, Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { Game, getGames } from "../services/gamesService";
import { Lobby, getAllLobbies, createLobby } from "../services/lobbiesService";
import { useLobbyActions } from '../hooks/useLobbyActions';

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GamesGrid from "../components/GamesGrid";
import LobbySidebar from "../components/LobbySidebar";
import InvitePlayerDialog from "../components/InvitePlayerDialog";

const getUserInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  const socket = useSocket();
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { handleJoin, handleLeave, handleInvite, handleStartGame, isInviteModalOpen, invitingLobby, closeInviteModal } = useLobbyActions(games);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [gamesData, lobbiesData] = await Promise.all([getGames(), getAllLobbies()]);
        setGames(gamesData);
        setLobbies(lobbiesData);
      } catch (err) {
        setError("Veriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleLobbyCreated = (newLobby: Lobby) => setLobbies((prev) => [...prev, newLobby]);
    const handleLobbyUpdated = (updatedLobby: Lobby) => setLobbies((prev) => prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)));
    const handleLobbyDeleted = (data: { id: string }) => setLobbies((prev) => prev.filter((l) => l.id !== data.id));
    const handleNavigate = ({ gameId, lobbyId }: { gameId: number, lobbyId: string }) => navigate(`/play/${gameId}`, { state: { lobbyId } });
    
    socket.on('lobby_created', handleLobbyCreated);
    socket.on('lobby_updated', handleLobbyUpdated);
    socket.on('lobby_deleted', handleLobbyDeleted);
    socket.on('navigate_to_game', handleNavigate);

    return () => {
      socket.off('lobby_created');
      socket.off('lobby_updated');
      socket.off('lobby_deleted');
      socket.off('navigate_to_game');
    };
  }, [socket, navigate]);

  const handleCreateLobby = async (name: string, gameId: number, maxPlayers: number) => {
    try { 
      const newLobby = await createLobby(name, gameId, maxPlayers);
      if (socket && newLobby) {
        socket.emit('join_game_room', newLobby.id);
      }
    } catch (err: any) { 
      alert(err.response?.data?.error || "Lobi oluşturulurken bir hata oluştu."); 
    }
  };

  const handleLogout = () => { if (logout) logout(); navigate("/login"); };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <>
      <CssBaseline />
      <InvitePlayerDialog open={isInviteModalOpen} onClose={closeInviteModal} lobby={invitingLobby} game={games.find(g => g.id === invitingLobby?.gameId) || null} />
      <HeaderBar username={user.username} notifCount={0} onAvatarClick={(e) => setMenuAnchor(e.currentTarget)} getInitials={getUserInitials} />
      <AvatarMenu anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} onProfile={() => { setProfileOpen(true); setMenuAnchor(null); }} onLogout={handleLogout} />
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} username={user.username} memberSince="Jan 2025" getInitials={getUserInitials} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : <GamesGrid games={games} />}
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <LobbySidebar
              games={games}
              lobbies={lobbies}
              onCreateLobby={handleCreateLobby}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onInvite={(lobby) => handleInvite(lobby)}
              onStartGame={handleStartGame}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}