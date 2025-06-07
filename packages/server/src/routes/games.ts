import { Router, Request, Response } from "express";
import { lobbies, createLobby, Lobby } from "../data/inMemoryStore";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { gameId } = req.query;
  if (gameId) {
    const filtered = lobbies.filter((l) => l.gameId === Number(gameId));
    res.json(filtered);
    return;
  }
  res.json(lobbies);
});

router.get("/:id", (req: Request, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  res.json(lobby);
});

router.post("/", auth, (req: Request, res: Response) => {
  const { name, gameId, maxPlayers } = req.body;
  if (!name || !gameId || !maxPlayers) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  const newLobby = createLobby(name, Number(gameId), Number(maxPlayers));
  res.status(201).json(newLobby);
});

router.put("/:id", auth, (req: Request, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  const { name, maxPlayers } = req.body;
  if (name !== undefined) {
    lobby.name = name;
  }
  if (maxPlayers !== undefined) {
    lobby.maxPlayers = Number(maxPlayers);
  }
  res.json(lobby);
});

router.delete("/:id", auth, (req: Request, res: Response) => {
  const idx = lobbies.findIndex((l) => l.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  lobbies.splice(idx, 1);
  res.status(204).send();
});

router.put("/:id/join", auth, (req: Request, res: Response) => {
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
  if (lobby.players >= lobby.maxPlayers) {
    lobby.status = "full";
  }
  res.json(lobby);
});

router.put("/:id/leave", auth, (req: Request, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  if (!lobby) {
    res.status(404).json({ error: "Lobby not found" });
    return;
  }
  if (lobby.players > 0) {
    lobby.players -= 1;
    if (lobby.status === "full") {
      lobby.status = "open";
    }
  }
  res.json(lobby);
});

export default router;