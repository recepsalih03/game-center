import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { TombalaBoard } from "game-tombala";
import { useSocket } from "../contexts/SocketContext";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
  },
});

export default function GamePlayPage() {
  const { id: lobbyId } = useParams<{ id: string }>();
  const socket = useSocket();

  if (!lobbyId) {
    return <Typography>Lobi ID'si bulunamadı.</Typography>;
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            bgcolor: "#fafafa",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Tombala Oyunu - Lobi: {lobbyId}
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <TombalaBoard socket={socket} lobbyId={lobbyId} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}