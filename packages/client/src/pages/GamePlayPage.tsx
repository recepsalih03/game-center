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
  const [gameState, setGameState] = useState<any>(null);
  
  const lobbyId = location.state?.lobbyId || `lobby_for_game_${gameId}`;

  useEffect(() => {
    if (!gameId) { setLoading(false); setError("Oyun ID'si bulunamadı."); return; }
    getGameById(gameId).then(data => { setGame(data); setLoading(false); }).catch(() => { setError("Oyun bilgileri yüklenemedi."); setLoading(false); });
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;
    const handleWinVerified = ({ winnerUsername, claimType }: { winnerUsername: string, claimType: string }) => {
      setGameLog((prevLog) => [...prevLog, `🎉 ${winnerUsername}, ${claimType.toUpperCase()} yaptı! 🎉`]);
    };
    const handleGameStateUpdate = (state: any) => {
      setGameState(state);
    };
    socket.on('win_verified', handleWinVerified);
    socket.on('game_state_update', handleGameStateUpdate);
    return () => {
      socket.off('win_verified', handleWinVerified);
      socket.off('game_state_update', handleGameStateUpdate);
    };
  }, [socket]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!user || !game) return <Typography>Oyun veya kullanıcı bilgisi bulunamadı.</Typography>;

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
              <TombalaBoard socket={socket} lobbyId={lobbyId} username={user.username} gameState={gameState} />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>Oyun Olayları</Typography>
            {gameState?.cinko1 && <Typography>1. Çinko: {gameState.cinko1}</Typography>}
            {gameState?.cinko2 && <Typography>2. Çinko: {gameState.cinko2}</Typography>}
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