import { Router, Response } from "express"
import { lobbies, createLobby } from "../data/inMemoryStore"
import { auth, AuthenticatedRequest } from "../middleware/auth"
import { io } from "../index"

const router = Router()

router.get("/", (req: AuthenticatedRequest, res: Response) => {
  const gameId = req.query.gameId as string | undefined
  if (gameId) {
    const filtered = lobbies.filter((l) => l.gameId === Number(gameId))
    res.json(filtered)
    return
  }
  res.json(lobbies)
})

router.post("/", auth, (req: AuthenticatedRequest, res: Response) => {
  const { name, gameId, maxPlayers, lobbyType, password, eventStartsAt, eventEndsAt } = req.body
  const username = req.user?.username

  if (!name || !gameId || !maxPlayers || !username || !lobbyType) {
    res.status(400).json({ error: "Eksik alanlar veya kullanıcı bilgisi bulunamadı." })
    return
  }

  if (lobbyType === "event") {
    if (!eventStartsAt || !eventEndsAt) {
      res.status(400).json({ error: "Etkinlik başlama ve bitiş tarihleri zorunlu." })
      return
    }
    if (new Date(eventEndsAt) < new Date(eventStartsAt)) {
      res.status(400).json({ error: "Bitiş tarihi başlangıç tarihinden önce olamaz." })
      return
    }
  }

  const userHasLobby = lobbies.some((l) => l.playerUsernames[0] === username)
  if (userHasLobby) {
    res.status(403).json({ error: "Zaten kurucusu olduğunuz bir lobi mevcut." })
    return
  }

  const newLobby = createLobby(
    {
      name,
      gameId,
      maxPlayers,
      lobbyType,
      password,
      eventStartsAt: lobbyType === "event" ? new Date(eventStartsAt) : undefined,
      eventEndsAt: lobbyType === "event" ? new Date(eventEndsAt) : undefined,
    },
    username,
  )

  io.emit("lobby_created", newLobby)
  res.status(201).json(newLobby)
})

router.put("/:id/join", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id)
  const username = req.user?.username

  if (!lobby || !username) {
    res.status(404).json({ error: "Lobi veya kullanıcı bulunamadı." })
    return
  }
  if (lobby.password && req.body.password !== lobby.password) {
    res.status(403).json({ error: "Hatalı lobi şifresi." })
    return
  }
  if (lobby.playerUsernames.includes(username)) {
    res.status(400).json({ error: "Kullanıcı zaten bu lobide." })
    return
  }
  if (lobby.status !== "open") {
    res.status(400).json({ error: "Lobi dolu veya oyun başladı." })
    return
  }

  lobby.players++
  lobby.playerUsernames.push(username)
  if (lobby.players >= lobby.maxPlayers) lobby.status = "full"

  io.emit("lobby_updated", lobby)
  res.json(lobby)
})

router.put("/:id/leave", auth, (req: AuthenticatedRequest, res: Response) => {
  const lobby = lobbies.find((l) => l.id === req.params.id)
  const username = req.user?.username

  if (!lobby || !username) {
    res.status(404).json({ error: "Lobi veya kullanıcı bulunamadı." })
    return
  }

  const idx = lobby.playerUsernames.indexOf(username)
  if (idx === -1) {
    res.status(400).json({ error: "Kullanıcı bu lobide değil." })
    return
  }

  lobby.players--
  lobby.playerUsernames.splice(idx, 1)

  if (lobby.players === 0) {
    const li = lobbies.findIndex((l) => l.id === lobby.id)
    if (li > -1) {
      lobbies.splice(li, 1)
      io.emit("lobby_deleted", { id: lobby.id })
      res.status(204).send()
      return
    }
  }

  if (lobby.players < lobby.maxPlayers) lobby.status = "open"

  io.emit("lobby_updated", lobby)
  res.json(lobby)
})

export default router