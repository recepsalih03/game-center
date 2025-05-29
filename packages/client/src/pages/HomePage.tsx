import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import api from "../api/axios";

const GameHomePage: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("Oyuncu");
  const [gameInfo, setGameInfo] = useState<string>("Yükleniyor...");

  useEffect(() => {
    api
      .get<{ info: string }>("/game-info")
      .then(res => setGameInfo(res.data.info))
      .catch(() => setGameInfo("Sunucuya bağlanılamadı veya bilgi alınamadı"));
  }, []);

  const startGame = () => {
    console.log("Oyun başlatılıyor...");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş geldin, {playerName}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Oyun Bilgisi: {gameInfo}
      </Typography>
      <Button variant="contained" color="primary" onClick={startGame}>
        Oyuna Başla
      </Button>
    </Box>
  );
};

export default GameHomePage;