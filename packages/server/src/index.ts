import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { games } from "./data/inMemoryStore";
import { auth } from "./middleware/auth";
import publicRoutes from "./routes/public";
import protectedRoutes from "./routes/protected";
import authRoutes from "./routes/auth";
import lobbiesRoutes from "./routes/lobbies";
import gamesRoutes from "./routes/games";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { handleTombalaEvents } from "./game-handlers/tombala.handler";

dotenv.config();
const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const userSocketMap = new Map<string, string>();

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
  console.log(`🔌 Yeni bir kullanıcı bağlandı: ${socket.id}`);

  socket.on('register_user', (username: string) => {
    userSocketMap.set(username, socket.id);
  });

  socket.on('send_invite', ({ fromUser, toUser, lobbyId, lobbyName, gameTitle }) => {
    const targetSocketId = userSocketMap.get(toUser);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_invite', {
        fromUser, lobbyId, lobbyName, gameTitle,
      });
    }
  });

  socket.on('join_game_room', (lobbyId: string) => {
    socket.join(lobbyId);
  });

  socket.on('leave_game_room', (lobbyId: string) => {
    socket.leave(lobbyId);
  });

  handleTombalaEvents(io, socket);

  socket.on("disconnect", () => {
    userSocketMap.forEach((id, u) => {
      if (id === socket.id) {
        userSocketMap.delete(u);
      }
    });
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => console.log(`🚀 API & WebSocket sunucusu çalışıyor ► http://localhost:${PORT}`));