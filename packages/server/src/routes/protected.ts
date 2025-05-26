import { Router, RequestHandler } from "express";
import { auth } from "../middleware/auth";

const router = Router();

const protectedHandler: RequestHandler = (req, res) => {
  res.json({ msg: "protected ok", user: (req as any).user });
};

router.get("/", auth, protectedHandler);

export default router;