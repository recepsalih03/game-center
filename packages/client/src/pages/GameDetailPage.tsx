import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Tabs,
  Tab,
  Grid,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { AuthContext } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { useLobbyActions } from "../hooks/useLobbyActions";

import HeaderBar from "../components/HeaderBar";
import AvatarMenu from "../components/AvatarMenu";
import ProfileDialog from "../components/ProfileDialog";
import GameOverview from "../components/GameOverview";
import HowToPlay from "../components/HowtoPlay";
import LobbyForm from "../components/GameLobbySection/LobbyForm";
import LobbyList from "../components/GameLobbySection/LobbyList";
import InvitePlayerDialog from "../components/InvitePlayerDialog";

import { Game, getGameById } from "../services/gamesService";
import { Lobby, getLobbiesByGameId, createLobby } from "../services/lobbiesService";

const TabPanel: React.FC<{ index: number; value: number; children: React.ReactNode }> = ({
  index,
  value,
  children,
}) => (index === value ? <Box pt={3}>{children}</Box> : null);

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const socket = useSocket();

  const [game, setGame] = useState<Game | null>(null);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profile, setProfile] = useState(false);
  const [tab, setTab] = useState(0);

  const { handleJoin, handleLeave, handleInvite, handleStartGame, isInviteModalOpen, invitingLobby, closeInviteModal } =
    useLobbyActions(game ? [game] : []);

  const canCreateLobby = user
    ? !lobbies.some(
        (l) =>
          l.playerUsernames[0] === user.username &&
          (l.lobbyType !== "event" || dayjs(l.eventEndsAt).isAfter(dayjs()))
      )
    : false;

  const fetchGameData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [gameData, lobbiesData] = await Promise.all([getGameById(id), getLobbiesByGameId(id)]);
      setGame(gameData);
      setLobbies(lobbiesData);
    } catch {
      setError("Oyun verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  useEffect(() => {
    const autoJoinLobbyId = (location.state as any)?.autoJoinLobbyId;
    if (autoJoinLobbyId && game) {
      const lobbyToJoin = lobbies.find((l) => l.id === autoJoinLobbyId);
      const userAlreadyInLobby = lobbyToJoin?.playerUsernames.includes(user?.username || "");

      if (lobbyToJoin && !userAlreadyInLobby) {
        handleJoin(autoJoinLobbyId, game.id);
      }

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, game, lobbies, user, handleJoin, navigate]);

  useEffect(() => {
    if (!socket || !id) return;
    const handleLobbyCreated = (newLobby: Lobby) => {
      if (newLobby.gameId === Number(id)) setLobbies((prev) => [newLobby, ...prev]);
    };
    const handleLobbyUpdated = (updatedLobby: Lobby) =>
      setLobbies((prev) => prev.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)));
    const handleLobbyDeleted = (data: { id: string }) =>
      setLobbies((prev) => prev.filter((l) => l.id !== data.id));
    const handleNavigate = ({ gameId, lobbyId }: { gameId: number; lobbyId: string }) => {
      if (gameId === Number(id)) navigate(`/play/${gameId}`, { state: { lobbyId } });
    };

    socket.on("lobby_created", handleLobbyCreated);
    socket.on("lobby_updated", handleLobbyUpdated);
    socket.on("lobby_deleted", handleLobbyDeleted);
    socket.on("navigate_to_game", handleNavigate);
    return () => {
      socket.off("lobby_created", handleLobbyCreated);
      socket.off("lobby_updated", handleLobbyUpdated);
      socket.off("lobby_deleted", handleLobbyDeleted);
      socket.off("navigate_to_game", handleNavigate);
    };
  }, [socket, id, navigate]);

  const handleCreateLobby = async (data: Partial<Lobby>) => {
    if (!game) return;
    try {
      const newLobbyData = { ...data, gameId: game.id };
      const newLobby = await createLobby(newLobbyData);
      if (socket && newLobby) {
        socket.emit("join_game_room", newLobby.id);
        navigate(location.pathname, { state: { autoJoinLobbyId: newLobby.id } });
      }
    } catch (err: any) {
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || loading) return <CircularProgress />;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;
  if (!game) return <Container><Typography>Oyun bulunamadı.</Typography></Container>;

  const initials = (name: string) => name.split(" ").map((x) => x[0]).join("").toUpperCase();
  const tabLabels = ["Genel Bakış", "Lobiler", "Nasıl Oynanır"];

  const handlePlaySolo = () => {
    const soloLobbyId = `solo_${user.username}_${Date.now()}`;
    navigate(`/play/${game.id}`, { state: { lobbyId: soloLobbyId } });
  };

  return (
    <>
      <CssBaseline />
      <InvitePlayerDialog open={isInviteModalOpen} onClose={closeInviteModal} lobby={invitingLobby} game={game} />
      <HeaderBar username={user.username} notifCount={0} onAvatarClick={(e) => setAnchor(e.currentTarget)} getInitials={initials} />
      <AvatarMenu anchorEl={anchor} onClose={() => setAnchor(null)} onProfile={() => { setProfile(true); setAnchor(null); }} onLogout={handleLogout} />
      <ProfileDialog open={profile} onClose={() => setProfile(false)} username={user.username} memberSince="Jan 2025" getInitials={initials} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {tabLabels.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
        <TabPanel index={0} value={tab}>
          <GameOverview game={game} />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" size="large" onClick={handlePlaySolo}>Tek Başına Oyna</Button>
            <Button variant="outlined" size="large" onClick={() => setTab(1)}>Lobilere Göz At</Button>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tab}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <LobbyForm games={[game]} onCreate={handleCreateLobby} canCreateLobby={canCreateLobby} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <LobbyList lobbies={lobbies} onJoin={handleJoin} onLeave={handleLeave} onInvite={handleInvite} onStartGame={handleStartGame} />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel index={2} value={tab}>
          <HowToPlay steps={game.howToPlaySteps} />
        </TabPanel>
      </Container>
    </>
  );
}