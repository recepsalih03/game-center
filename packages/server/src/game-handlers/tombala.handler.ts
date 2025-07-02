import { Server, Socket } from "socket.io"
import { lobbies } from "../data/inMemoryStore"

interface TombalaGameState {
  drawnNumbers: Set<number>
  players: string[]
  cinko1: string | null
  cinko2: string | null
  tombala: string | null
}

export const activeTombalaGames = new Map<string, TombalaGameState>()

export function startTombalaGame(lobbyId: string, io: Server) {
  if (activeTombalaGames.has(lobbyId)) return
  const lobby = lobbies.find((l) => l.id === lobbyId)
  if (!lobby) return
  lobby.status = "in-progress"
  io.emit("lobby_updated", lobby)
  const newState: TombalaGameState = {
    drawnNumbers: new Set(),
    players: lobby.playerUsernames,
    cinko1: null,
    cinko2: null,
    tombala: null,
  }
  activeTombalaGames.set(lobbyId, newState)
  io.to(lobbyId).emit("navigate_to_game", { gameId: lobby.gameId, lobbyId: lobby.id })
  io.to(lobbyId).emit("game_state_update", newState)
}

export function handleTombalaEvents(io: Server, socket: Socket) {
  const drawNumber = ({ lobbyId, number }: { lobbyId: string; number: number }) => {
    const state = activeTombalaGames.get(lobbyId)
    if (!state) return
    state.drawnNumbers.add(number)
    io.to(lobbyId).emit("tombala_number_drawn", { lobbyId, number })
  }

  const claimWin = ({
    lobbyId,
    username,
    claimType,
    board,
  }: {
    lobbyId: string
    username: string
    claimType: "cinko1" | "cinko2" | "tombala"
    board: { value: number | null }[][]
  }) => {
    const state = activeTombalaGames.get(lobbyId)
    if (!state) return
    let allowed = true
    if (claimType === "cinko1" && state.cinko1) allowed = false
    if (claimType === "cinko2" && (state.cinko2 || !state.cinko1)) allowed = false
    if (claimType === "tombala" && (state.tombala || !state.cinko2)) allowed = false
    if (!allowed) return
    let valid = false
    const drawn = state.drawnNumbers
    if (claimType === "tombala") {
      const nums = board.flat().filter((c) => c.value !== null).map((c) => c.value as number)
      valid = nums.every((n) => drawn.has(n))
    } else {
      let rows = 0
      board.forEach((row) => {
        const nums = row.filter((c) => c.value !== null).map((c) => c.value as number)
        if (nums.length === 5 && nums.every((n) => drawn.has(n))) rows++
      })
      if (claimType === "cinko1" && rows >= 1) valid = true
      if (claimType === "cinko2" && rows >= 2) valid = true
    }
    if (!valid) return
    ;(state as any)[claimType] = username
    io.to(lobbyId).emit("win_verified", { winnerUsername: username, claimType })
    io.to(lobbyId).emit("game_state_update", state)
    if (claimType === "tombala") {
      io.to(lobbyId).emit("game_over", { winnerUsername: username })
      activeTombalaGames.delete(lobbyId)
      const i = lobbies.findIndex((l) => l.id === lobbyId)
      if (i > -1) {
        lobbies.splice(i, 1)
        io.emit("lobby_deleted", { id: lobbyId })
      }
    }
  }

  socket.on("start_game", (lobbyId: string) => startTombalaGame(lobbyId, io))
  socket.on("tombala_number_drawn", drawNumber)
  socket.on("claim_win", claimWin)
}