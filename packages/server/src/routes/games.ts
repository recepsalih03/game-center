import { Router, Request, Response } from "express";
import { games } from "../data/inMemoryStore";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(games);
});

router.get("/:id", (req: Request, res: Response) => {
  const game = games.find((g) => g.id === Number(req.params.id));
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  res.json(game);
});

router.post("/:id/result", (req: Request, res: Response) => {
  const { winner, duration } = req.body;
  res.json({ status: "saved" });
});

export default router;