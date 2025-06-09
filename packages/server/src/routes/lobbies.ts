import { Router, Response } from "express";
import { lobbies, createLobby } from "../data/inMemoryStore";
import { auth, AuthenticatedRequest } from "../middleware/auth";
import { io } from "../index";

const router = Router();

router.get("/", (req: AuthenticatedRequest, res: Response) => {
  const { gameId } = req.query;
  if (gameId) {
    const filtered = lobbies.filter((l) => l.gameId === Number(gameId));
    res.json(filtered);
  } else {
    res.json(lobbies);
  }
});

router.get("/:id", (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  res.json(lobby);
});

router.post("/", auth, (req: AuthenticatedRequest, res: Response) => {
  const { name, gameId, maxPlayers } = req.body;
  const username = req.user?.username;
  if (!name || !gameId || !maxPlayers || !username) {
    res.status(400).json({ error: "Eksik alanlar veya kullanıcı bilgisi bulunamadı." });
    return;
  }
  const newLobby = createLobby(name, Number(gameId), Number(maxPlayers), username);
  io.emit('lobby_created', newLobby);
  res.status(201).json(newLobby);
});

router.put("/:id/join", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  const username = req.user?.username;

  if (!lobby || !username) {
    res.status(404).json({ error: "Lobi veya kullanıcı bulunamadı." });
    return;
  }
  if (lobby.playerUsernames.includes(username)) {
    res.status(400).json({ error: "Kullanıcı zaten bu lobide." });
    return;
  }
  if (lobby.status === "full") {
    res.status(400).json({ error: "Lobi dolu." });
    return;
  }

  lobby.players++;
  lobby.playerUsernames.push(username);
  if (lobby.players >= lobby.maxPlayers) {
    lobby.status = "full";
  }
  io.emit('lobby_updated', lobby);
  res.json(lobby);
});

export default router;