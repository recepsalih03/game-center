import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.use(logger);

app.get("/api/public", (_req, res) => {
  res.json({ msg: "public ok" });
});

app.get("/api/protected", auth, (req, res) => {
  res.json({ msg: "protected ok", user: (req as any).user });
});

app.use(errorHandler);

app.listen(4000, () => console.log("API ► http://localhost:4000"));