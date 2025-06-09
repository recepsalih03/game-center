import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import publicRoutes from "./routes/public";
import protectedRoutes from "./routes/protected";
import authRoutes from "./routes/auth";
import lobbiesRoutes from "./routes/lobbies";
import gamesRoutes from "./routes/games";

import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { games } from "./data/inMemoryStore";

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
}
const activeTombalaGames = new Map<string, TombalaGameState>();

interface Cell {
  value: number | null;
}

io.on("connection", (socket) => {
  console.log(`🔌 Yeni bir kullanıcı bağlandı: ${socket.id}`);

  socket.on('register_user', (username: string) => {
    console.log(`Kullanıcı "${username}" soket ${socket.id} ile kaydedildi.`);
    userSocketMap.set(username, socket.id);
  });

  socket.on('send_invite', ({ fromUser, toUser, gameId }) => {
    console.log(`"${fromUser}" kullanıcısı "${toUser}" kullanıcısını ${gameId} oyununa davet ediyor.`);
    const targetSocketId = userSocketMap.get(toUser);
    const game = games.find(g => g.id === gameId);
    if (targetSocketId && game) {
      io.to(targetSocketId).emit('receive_invite', {
        fromUser,
        gameTitle: game.title,
        gameId,
      });
    }
  });

  socket.on('join_game_room', (lobbyId: string) => {
    socket.join(lobbyId);
    console.log(`Kullanıcı ${socket.id}, ${lobbyId} odasına katıldı.`);
  });

  socket.on('start_game', (lobbyId: string) => {
    if (activeTombalaGames.has(lobbyId)) return;
    console.log(`${lobbyId} odasındaki oyun başlatılıyor.`);
    const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    activeTombalaGames.set(lobbyId, {
      drawnNumbers: new Set(),
      intervalId: null,
      players: [],
    });
    const gameState = activeTombalaGames.get(lobbyId)!;
    gameState.intervalId = setInterval(() => {
      if (availableNumbers.length === 0) {
        clearInterval(gameState.intervalId!);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers.splice(randomIndex, 1)[0];
      gameState.drawnNumbers.add(newNumber);
      console.log(`${lobbyId} odası için yeni sayı çekildi: ${newNumber}`);
      io.to(lobbyId).emit('tombala_number_drawn', newNumber);
    }, 5000);
  });

  socket.on('claim_win', ({ lobbyId, username, claimType, board }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (!gameState) return;

    console.log(`"${username}" kullanıcısı "${claimType}" iddiasında bulundu.`);
    let isWinValid = false;
    const drawnNumbers = gameState.drawnNumbers;

    if (claimType === 'tombala') {
      const allNumbersOnBoard = board.flat().filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
      isWinValid = allNumbersOnBoard.every((num: number) => drawnNumbers.has(num!));
    } else {
      for (const row of board) {
        const numbersInRow = row.filter((cell: Cell) => cell.value !== null).map((cell: Cell) => cell.value);
        if (numbersInRow.length > 0 && numbersInRow.every((num: number) => drawnNumbers.has(num!))) {
          isWinValid = true;
          break;
        }
      }
    }

    if (isWinValid) {
      console.log(`"${username}" kullanıcısının "${claimType}" iddiası DOĞRU!`);
      io.to(lobbyId).emit('win_verified', { winnerUsername: username, claimType });
      if (claimType === 'tombala' && gameState.intervalId) {
        clearInterval(gameState.intervalId);
        activeTombalaGames.delete(lobbyId);
        console.log(`${lobbyId} odasındaki oyun sona erdi.`);
      }
    } else {
      console.log(`"${username}" kullanıcısının "${claimType}" iddiası YANLIŞ!`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Kullanıcı bağlantısı kesildi: ${socket.id}`);
    userSocketMap.forEach((id, username) => {
      if (id === socket.id) {
        userSocketMap.delete(username);
        console.log(`Kullanıcı "${username}" kaydı silindi.`);
      }
    });
  });
});

const PORT = 4000;
httpServer.listen(PORT, () =>
  console.log(`🚀 API & WebSocket sunucusu çalışıyor ► http://localhost:${PORT}`)
);