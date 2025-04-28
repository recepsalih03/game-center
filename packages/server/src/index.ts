import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import publicRoutes from "./routes/public";
import protectedRoutes from "./routes/protected";
import authRoutes from "./routes/auth";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);


app.use("/api", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/protected", protectedRoutes);

app.use(errorHandler);

app.listen(4000, () =>
  console.log("API ► http://localhost:4000")
);