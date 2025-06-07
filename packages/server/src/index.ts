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

io.on("connection", (socket) => {
  console.log(`🔌 Yeni bir kullanıcı bağlandı: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`🔌 Kullanıcı bağlantısı kesildi: ${socket.id}`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () =>
  console.log(`🚀 API & WebSocket sunucusu çalışıyor ► http://localhost:${PORT}`)
);