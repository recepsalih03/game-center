import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import { games as dummyGames } from "../lib/dummy-data";

import { TombalaBoard } from "../../../game-tombala/dist/TombalaBoard";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
  },
});

export default function GamePlayPage() {
  const { id } = useParams<{ id: string }>();
  const game = dummyGames.find((g) => g.id === Number(id));
  const navigate = useNavigate();

  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [profile, setProfile] = React.useState(false);
  const initials = (n: string) =>
    n
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase();

  if (!game) return <div>Game not found</div>;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <HeaderBar
        username="John Doe"
        notifCount={4}
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
          }}
        >
          <TombalaBoard />
        </Box>
      </Container>
    </ThemeProvider>
  );
}