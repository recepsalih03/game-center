import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { logger } from "./middleware/logger"
import { errorHandler } from "./middleware/errorHandler"
import publicRoutes from "./routes/public"
import protectedRoutes from "./routes/protected"
import authRoutes from "./routes/auth"
import lobbiesRoutes from "./routes/lobbies"
import gamesRoutes from "./routes/games"
import { handleTombalaEvents, startTombalaGame } from "./game-handlers/tombala.handler"
import { lobbies } from "./data/inMemoryStore"

dotenv.config()

const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
})

const userSocketMap = new Map<string, string>()
const pendingInvites = new Map<string, any[]>()

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }))
app.use(express.json())
app.use(logger)
app.use("/api", authRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/protected", protectedRoutes)
app.use("/api/lobbies", lobbiesRoutes)
app.use("/api/games", gamesRoutes)
app.use(errorHandler)

io.on("connection", (socket: Socket) => {
  socket.on("register_user", (username: string) => {
    userSocketMap.set(username, socket.id)
    const invites = pendingInvites.get(username)
    if (invites) {
      invites.forEach((i) => socket.emit("receive_invite", i))
      pendingInvites.delete(username)
    }
  })

  socket.on("send_invite", (data) => {
    const target = userSocketMap.get(data.toUser)
    if (target) io.to(target).emit("receive_invite", data)
    else {
      const list = pendingInvites.get(data.toUser) || []
      list.push(data)
      pendingInvites.set(data.toUser, list)
    }
  })

  socket.on("join_game_room", (lobbyId: string) => socket.join(lobbyId))
  socket.on("leave_game_room", (lobbyId: string) => socket.leave(lobbyId))

  handleTombalaEvents(io, socket)

  socket.on("disconnect", () => {
    userSocketMap.forEach((id, u) => {
      if (id === socket.id) userSocketMap.delete(u)
    })
  })
})

setInterval(() => {
  const now = new Date()
  lobbies.forEach((l) => {
    if (
      l.lobbyType === "event" &&
      l.status !== "in-progress" &&
      l.eventStartsAt &&
      new Date(l.eventStartsAt) <= now
    )
      startTombalaGame(l.id, io)
  })
}, 1000)

httpServer.listen(4000, () => console.log("🚀 API & WebSocket sunucusu ► http://localhost:4000"))