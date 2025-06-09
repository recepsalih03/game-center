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
  if (lobby.status !== "open") {
    res.status(400).json({ error: "Lobi dolu veya oyun başladı." });
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

router.put("/:id/leave", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id);
  const username = req.user?.username;

  if (!lobby || !username) {
    res.status(404).json({ error: "Lobi veya kullanıcı bulunamadı." });
    return;
  }
  
  const playerIndex = lobby.playerUsernames.indexOf(username);
  if (playerIndex === -1) {
    res.status(400).json({ error: "Kullanıcı bu lobide değil." });
    return;
  }

  lobby.players--;
  lobby.playerUsernames.splice(playerIndex, 1);
  
  if (lobby.players < lobby.maxPlayers) {
    lobby.status = "open";
  }
  
  if (lobby.players === 0) {
    const lobbyIndex = lobbies.findIndex(l => l.id === lobby.id);
    if(lobbyIndex > -1) {
        lobbies.splice(lobbyIndex, 1);
        io.emit('lobby_deleted', { id: lobby.id });
        res.status(204).send();
        return;
    }
  }
  
  io.emit('lobby_updated', lobby);
  res.json(lobby);
});

export default router;