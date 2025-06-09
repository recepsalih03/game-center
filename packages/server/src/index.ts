import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { lobbies, createLobby, games } from "./data/inMemoryStore";
import { auth, AuthenticatedRequest } from "./middleware/auth";
import publicRoutes from "./routes/public";
import protectedRoutes from "./routes/protected";
import authRoutes from "./routes/auth";
import lobbiesRoutes from "./routes/lobbies";
import gamesRoutes from "./routes/games";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
const userSocketMap = new Map<string, string>();
interface TombalaGameState {
  drawnNumbers: Set<number>;
  players: string[];
  cinko1: string | null;
  cinko2: string | null;
  tombala: string | null;
}
const activeTombalaGames = new Map<string, TombalaGameState>();
interface Cell { value: number | null; }

app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(logger);
app.use("/api", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/lobbies", lobbiesRoutes);
app.use("/api/games", gamesRoutes);
app.use(errorHandler);

io.on("connection", (socket: Socket) => {
  socket.on('register_user', (username: string) => userSocketMap.set(username, socket.id));

  socket.on('join_game_room', (lobbyId: string) => {
    socket.join(lobbyId);
    const gameState = activeTombalaGames.get(lobbyId);
    if (gameState) {
      socket.emit('game_state_update', gameState);
    }
  });

  socket.on('start_game', (lobbyId: string) => {
    if (activeTombalaGames.has(lobbyId)) return;
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    lobby.status = 'in-progress';
    io.emit('lobby_updated', lobby);

    const newGameState: TombalaGameState = {
      drawnNumbers: new Set(),
      players: lobby.playerUsernames,
      cinko1: null,
      cinko2: null,
      tombala: null,
    };
    activeTombalaGames.set(lobbyId, newGameState);
    io.to(lobbyId).emit('navigate_to_game', { gameId: lobby.gameId, lobbyId: lobby.id });
    io.to(lobbyId).emit('game_state_update', newGameState);
  });

  socket.on('tombala_number_drawn', ({ lobbyId, number }: { lobbyId: string, number: number }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (gameState) {
      gameState.drawnNumbers.add(number);
      socket.to(lobbyId).emit('tombala_number_drawn', number);
    }
  });

  socket.on('claim_win', ({ lobbyId, username, claimType, board }: { lobbyId: string, username: string, claimType: 'cinko1' | 'cinko2' | 'tombala', board: Cell[][] }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (!gameState) return;
    
    let isWinValid = false;
    const drawnNumbers = gameState.drawnNumbers;
    if (claimType === 'tombala') {
      const allNumbersOnBoard = board.flat().filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
      isWinValid = allNumbersOnBoard.every((num: number | null) => num !== null && drawnNumbers.has(num));
    } else {
      let completedRows = 0;
      for (const row of board) {
        const numbersInRow = row.filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
        if (numbersInRow.length === 5 && numbersInRow.every((num: number | null) => num !== null && drawnNumbers.has(num))) {
          completedRows++;
        }
      }
      if (claimType === 'cinko1' && completedRows >= 1 && !gameState.cinko1) isWinValid = true;
      if (claimType === 'cinko2' && completedRows >= 2 && gameState.cinko1 && !gameState.cinko2) isWinValid = true;
    }

    if (isWinValid) {
      (gameState as any)[claimType] = username;
      io.to(lobbyId).emit('win_verified', { winnerUsername: username, claimType });
      io.to(lobbyId).emit('game_state_update', gameState);
      
      if (claimType === 'tombala') {
        io.to(lobbyId).emit('game_over', { winnerUsername: username });
        activeTombalaGames.delete(lobbyId);
        const lobbyIndex = lobbies.findIndex(l => l.id === lobbyId);
        if (lobbyIndex > -1) {
          lobbies.splice(lobbyIndex, 1);
          io.emit('lobby_deleted', { id: lobbyId });
        }
      }
    }
  });

  socket.on("disconnect", () => {
    userSocketMap.forEach((id, u) => { if (id === socket.id) userSocketMap.delete(u); });
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => console.log(`🚀 API & WebSocket sunucusu çalışıyor ► http://localhost:${PORT}`));