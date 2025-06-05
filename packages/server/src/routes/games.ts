import { Router, Request, Response } from "express";
import { games } from "../data/inMemorystore";

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
  console.log(`Game ${req.params.id} ended. Winner: ${winner}, Duration: ${duration}`);
  res.json({ status: "saved" });
});

export default router;