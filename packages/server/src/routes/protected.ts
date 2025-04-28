import { Router } from "express";
import { auth } from "../middleware/auth";
const router = Router();
router.get("/", auth, (req, res) => {
  res.json({ msg: "protected ok", user: (req as any).user });
});
export default router;