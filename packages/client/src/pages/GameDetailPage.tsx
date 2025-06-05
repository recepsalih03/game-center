import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GameOverview from "../components/GameOverview";
import HowToPlay from "../components/HowtoPlay";
import GameSettings from "../components/GameSettings";
import GameHistory from "../components/GameHistory";
import LobbyForm from "../components/GameLobbySection/LobbyForm";
import LobbyList from "../components/GameLobbySection/LobbyList";

import {
  games as dummyGames,
  lobbies as dummyLobbies,
  histories as dummyHistories,
} from "../lib/dummy-data";
import type { Lobby } from "../lib/dummy-data";

const lightTheme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" }, secondary: { main: "#ff9800" } },
});

const TabPanel: React.FC<{ index: number; value: number; children: React.ReactNode }> = ({
  index,
  value,
  children,
}) => (index === value ? <Box pt={2}>{children}</Box> : null);

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState(false);
  const [tab, setTab] = useState(0);

  const game = dummyGames.find((g) => g.id === Number(id));

  if (!game) {
    return <div>Game not found</div>;
  }

  const lobbies: Lobby[] = dummyLobbies.filter((l) => l.game === game.title);
  const history = dummyHistories[game.id] ?? [];

  const initials = (n: string) => n.split(" ").map((x) => x[0]).join("").toUpperCase();

  const handleCreateLobby = (name: string, size: number) => {
    console.log("create lobby", { name, size, gameId: game.id });
  };

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
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
          {["Overview", "Lobbies", "History", "How to Play", "Settings"].map((lbl, i) => (
            <Tab key={i} label={lbl} />
          ))}
        </Tabs>

        <TabPanel index={0} value={tab}>
          <GameOverview game={game} />
          <Box mt={3}>
            <Button variant="contained" size="large" onClick={() => navigate(`/play/${game.id}`)}>
              Launch Game
            </Button>
          </Box>
        </TabPanel>

        <TabPanel index={1} value={tab}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <LobbyForm onCreate={handleCreateLobby} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <LobbyList lobbies={lobbies} />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel index={2} value={tab}>
          <GameHistory history={history} />
        </TabPanel>

        <TabPanel index={3} value={tab}>
          <HowToPlay steps={["Move with WASD", "Aim with mouse", "Press SPACE to jump"]} />
        </TabPanel>

        <TabPanel index={4} value={tab}>
          <GameSettings onSave={(s) => console.log("settings saved", s)} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}