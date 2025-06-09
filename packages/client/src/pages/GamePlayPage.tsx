import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  List, ListItem, ListItemText,
  CircularProgress
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { TombalaBoard } from "game-tombala";
import { useSocket } from "../contexts/SocketContext";
import { AuthContext } from "../contexts/AuthContext";
import { Game, getGameById } from "../services/gamesService";

export default function GamePlayPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const location = useLocation();
  const socket = useSocket();
  const { user } = useContext(AuthContext);

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);
  
  const lobbyId = location.state?.lobbyId || `lobby_for_game_${gameId}`;

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      setError("Oyun ID'si bulunamadı.");
      return;
    }
    getGameById(gameId)
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Oyun bilgileri yüklenemedi.");
        setLoading(false);
      });
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;
    const handleWinVerified = ({ winnerUsername, claimType }: { winnerUsername: string, claimType: string }) => {
      const message = `🎉 ${winnerUsername}, ${claimType.toUpperCase()} yaptı! Tebrikler! 🎉`;
      setGameLog((prevLog) => [...prevLog, message]);
    };
    socket.on('win_verified', handleWinVerified);
    return () => {
      socket.off('win_verified', handleWinVerified);
    };
  }, [socket]);

  const renderGameComponent = () => {
    if (!game) return null;

    switch (game.gameComponent) {
      case "TombalaBoard":
        return <TombalaBoard socket={socket} lobbyId={lobbyId} username={user ? user.username : null} />;
      
      default:
        return <Typography>Bu oyun bileşeni henüz desteklenmiyor.</Typography>;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="h5" gutterBottom>
              {game?.title} - Lobi: {lobbyId}
            </Typography>
            <Box sx={{ width: "100%", mt: 2 }}>
              {renderGameComponent()}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>Oyun Olayları</Typography>
            <List dense>
              {gameLog.map((log, index) => (
                <ListItem key={index}>
                  <ListItemText primary={log} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}