import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <HeaderBar
        username={username}
        notifCount={0}
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

      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          mb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tombala Oyununa Hoşgeldiniz
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Bu sayfadan doğrudan Tombala oyununu başlatabilirsiniz.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/play")}
          sx={{ py: 1.5, px: 4 }}
        >
          Tombala Oyna
        </Button>
      </Container>
    </ThemeProvider>
  );
}