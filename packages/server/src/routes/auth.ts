import { Router } from "express";
import { users } from "../../../config/users";
import { createHash } from "crypto";
import {
  signAccess,
  signRefresh,
  verifyRefresh,
} from "../utils/jwt";

const router = Router();
const refreshStore = new Set<string>();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const hash = createHash("sha256").update(password).digest("hex");
  if (hash !== user.passwordHash) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = signAccess({ email: user.email });
  const refreshToken = signRefresh({ email: user.email });
  refreshStore.add(refreshToken);

  res.json({
    user: { email: user.email },
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshStore.has(refreshToken)) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  try {
    const payload = verifyRefresh(refreshToken) as any;
    const newAccess = signAccess({ email: payload.email });
    res.json({ accessToken: newAccess });
  } catch {
    res.status(401).json({ error: "Refresh token expired" });
  }
});

export default router;