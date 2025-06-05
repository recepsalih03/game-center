import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";

import { TombalaBoard } from "game-tombala";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
  },
});

export default function GamePlayPage() {
  const navigate = useNavigate();

  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [profile, setProfile] = React.useState(false);
  const initials = (n: string) =>
    n
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <HeaderBar
        username="John Doe"
        notifCount={0}
        onAvatarClick={(e) => setAnchor(e.currentTarget)}
        getInitials={initials}
      />

      <AvatarMenu
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        onProfile={() => {
          setAnchor(null);
          setProfile(true);
        }}
        onLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      />

      <ProfileDialog
        open={profile}
        onClose={() => setProfile(false)}
        username="John Doe"
        email="john.doe@example.com"
        memberSince="Jan 2024"
        getInitials={initials}
      />

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
            Tombala Kartınızı Aşağıda Görüntüleyebilirsiniz
          </Typography>

          <Box sx={{ width: "100%", mt: 2 }}>
            <TombalaBoard />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}