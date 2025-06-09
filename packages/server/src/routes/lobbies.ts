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
    return;
  }
  res.json(lobbies);
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
  if (!name || !gameId || !maxPlayers) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  const newLobby = createLobby(name, Number(gameId), Number(maxPlayers));
  io.emit('lobby_created', newLobby);
  res.status(201).json(newLobby);
});

router.put("/:id", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  const { name, maxPlayers } = req.body;
  if (name !== undefined) lobby.name = name;
  if (maxPlayers !== undefined) lobby.maxPlayers = Number(maxPlayers);
  io.emit('lobby_updated', lobby);
  res.json(lobby);
});

router.delete("/:id", auth, (req: AuthenticatedRequest, res: Response) => {
  const idx = lobbies.findIndex((l) => l.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  const lobbyId = lobbies[idx].id;
  lobbies.splice(idx, 1);
  io.emit('lobby_deleted', { id: lobbyId });
  res.status(204).send();
});

router.put("/:id/join", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  if (lobby.status === "full") {
    res.status(400).json({ error: "Lobby is already full" });
    return;
  }
  lobby.players += 1;
  if (lobby.players >= lobby.maxPlayers) lobby.status = "full";
  io.emit('lobby_updated', lobby);
  res.json(lobby);
});

router.put("/:id/leave", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  if (lobby.players > 0) {
    lobby.players -= 1;
    if (lobby.status === "full") lobby.status = "open";
  }
  io.emit('lobby_updated', lobby);
  res.json(lobby);
});

export default router;