import React, { useState, useEffect, useContext } from "react";
import {
  Box, Container, CssBaseline, Typography, List, ListItem, ListItemText, CircularProgress
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { TombalaBoard } from "game-tombala";
import { useSocket } from "../contexts/SocketContext";
import { AuthContext } from "../contexts/AuthContext";
import { Game, getGameById } from "../services/gamesService";
import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GameOverDialog from "../components/GameOverDialog";

export default function GamePlayPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const location = useLocation();
  const socket = useSocket();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  
  const lobbyId = location.state?.lobbyId;

  useEffect(() => {
    if (!gameId) { setLoading(false); setError("Oyun ID'si bulunamadı."); return; }
    getGameById(gameId).then(setGame).catch(() => setError("Oyun bilgileri yüklenemedi.")).finally(() => setLoading(false));
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_game_room', lobbyId);
    
    const handleWinVerified = ({ winnerUsername, claimType }: { winnerUsername: string, claimType: string }) => setGameLog((prev) => [...prev, `🎉 ${winnerUsername}, ${claimType.toUpperCase()} yaptı! 🎉`]);
    const handleGameStateUpdate = (state: any) => setGameState(state);
    const handleGameOver = ({ winnerUsername }: { winnerUsername: string }) => {
      setWinner(winnerUsername);
      setGameOver(true);
    };

    socket.on('win_verified', handleWinVerified);
    socket.on('game_state_update', handleGameStateUpdate);
    socket.on('game_over', handleGameOver);
    return () => {
      socket.off('win_verified');
      socket.off('game_state_update');
      socket.off('game_over');
    };
  }, [socket, lobbyId]);

  const handleLogout = () => { if (logout) logout(); navigate("/"); };
  const initials = (name: string) => name.split(" ").map((x) => x[0]).join("").toUpperCase();

  if (loading || !user) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!game) return <Typography>Oyun bulunamadı.</Typography>;

  return (
    <>
      <CssBaseline />
      <GameOverDialog open={isGameOver} winner={winner} />
      <HeaderBar username={user.username} notifCount={0} onAvatarClick={(e) => setAnchor(e.currentTarget)} getInitials={initials} />
      <AvatarMenu anchorEl={anchor} onClose={() => setAnchor(null)} onProfile={() => setProfile(true)} onLogout={handleLogout} />
      <ProfileDialog open={profile} onClose={() => setProfile(false)} username={user.username} email={`${user.username}@example.com`} memberSince="Jan 2025" getInitials={initials} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {game.title}
        </Typography>
        <TombalaBoard socket={socket} lobbyId={lobbyId} username={user.username} gameState={gameState} />
      </Container>
    </>
  );
}