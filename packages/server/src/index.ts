import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import publicRoutes from "./routes/public";
import protectedRoutes from "./routes/protected";
import authRoutes from "./routes/auth";
import lobbiesRoutes from "./routes/lobbies";
import gamesRoutes from "./routes/games";

import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { games, lobbies } from "./data/inMemoryStore";

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

app.use("/api", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/lobbies", lobbiesRoutes);
app.use("/api/games", gamesRoutes);

app.use(errorHandler);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map<string, string>();

interface TombalaGameState {
  drawnNumbers: Set<number>;
  intervalId: NodeJS.Timeout | null;
  players: string[];
  cinko1: string | null;
  cinko2: string | null;
  tombala: string | null;
}
const activeTombalaGames = new Map<string, TombalaGameState>();

interface Cell { value: number | null; }

io.on("connection", (socket: Socket) => {
  socket.on('register_user', (username: string) => {
    userSocketMap.set(username, socket.id);
  });

  socket.on('send_invite', ({ fromUser, toUser, lobbyId, lobbyName, gameTitle }: { fromUser: string, toUser: string, lobbyId: string, lobbyName: string, gameTitle: string }) => {
    const targetSocketId = userSocketMap.get(toUser);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_invite', {
        fromUser,
        lobbyId,
        lobbyName,
        gameTitle,
      });
    }
  });

  socket.on('join_game_room', (lobbyId: string) => {
    socket.join(lobbyId);
  });

  socket.on('start_game', (lobbyId: string) => {
    if (activeTombalaGames.has(lobbyId)) return;
    
    console.log(`[SERVER] Received start_game for lobby: ${lobbyId}. Starting number draw...`);
    
    const lobby = lobbies.find(l => l.id === lobbyId);
    
    const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    const newGameState: TombalaGameState = {
      drawnNumbers: new Set(),
      intervalId: null,
      players: lobby ? lobby.playerUsernames : [],
      cinko1: null,
      cinko2: null,
      tombala: null,
    };
    activeTombalaGames.set(lobbyId, newGameState);
    
    if(lobby) {
        lobby.status = 'in-progress';
        io.emit('lobby_updated', lobby);
        io.to(lobbyId).emit('navigate_to_game', { gameId: lobby.gameId, lobbyId: lobby.id });
    }
    
    io.to(lobbyId).emit('game_state_update', newGameState);
    
    newGameState.intervalId = setInterval(() => {
      if (availableNumbers.length === 0) {
        clearInterval(newGameState.intervalId!);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers.splice(randomIndex, 1)[0];
      newGameState.drawnNumbers.add(newNumber);
      io.to(lobbyId).emit('tombala_number_drawn', newNumber);
    }, 5000);
  });

  socket.on('claim_win', ({ lobbyId, username, claimType, board }: { lobbyId: string, username: string, claimType: 'cinko1' | 'cinko2' | 'tombala', board: Cell[][] }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (!gameState) return;
    
    let isClaimAllowed = true;
    if (claimType === 'cinko1' && gameState.cinko1) isClaimAllowed = false;
    if (claimType === 'cinko2' && (gameState.cinko2 || !gameState.cinko1)) isClaimAllowed = false;
    if (claimType === 'tombala' && (gameState.tombala || !gameState.cinko2)) isClaimAllowed = false;
    
    if (!isClaimAllowed) return;

    let isWinValid = false;
    const drawnNumbers = gameState.drawnNumbers;
    if (claimType === 'tombala') {
      const allNumbersOnBoard = board.flat().filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
      isWinValid = allNumbersOnBoard.every((num) => num !== null && drawnNumbers.has(num));
    } else {
      let completedRows = 0;
      for (const row of board) {
        const numbersInRow = row.filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
        if (numbersInRow.length > 0 && numbersInRow.every((num) => num !== null && drawnNumbers.has(num))) {
          completedRows++;
        }
      }
      if (claimType === 'cinko1' && completedRows >= 1) isWinValid = true;
      if (claimType === 'cinko2' && completedRows >= 2) isWinValid = true;
    }

    if (isWinValid) {
      (gameState as any)[claimType] = username;
      io.to(lobbyId).emit('win_verified', { winnerUsername: username, claimType });
      io.to(lobbyId).emit('game_state_update', gameState);
      
      if (claimType === 'tombala' && gameState.intervalId) {
        clearInterval(gameState.intervalId);
        activeTombalaGames.delete(lobbyId);
      }
    }
  });

  socket.on("disconnect", () => {
    userSocketMap.forEach((id, username) => {
      if (id === socket.id) userSocketMap.delete(username);
    });
  });
});

const PORT = 4000;
httpServer.listen(PORT, () =>
  console.log(`🚀 API & WebSocket sunucusu çalışıyor ► http://localhost:${PORT}`)
);