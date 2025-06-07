import { Router, RequestHandler } from "express";
import { users } from "../../../config/users";
import { hashData } from "../utils/hash";
import {
  signAccess,
  signRefresh,
  verifyRefresh,
} from "../utils/jwt";

const router = Router();
const refreshStore = new Set<string>();

const loginHandler: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const passwordHash = hashData(password);
  if (passwordHash !== user.passwordHash) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = signAccess({ username: user.username });
  const refreshToken = signRefresh({ username: user.username });
  refreshStore.add(refreshToken);

  res.json({
    user: { username: user.username },
    accessToken,
    refreshToken,
  });
};

const refreshHandler: RequestHandler = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshStore.has(refreshToken)) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }
  try {
    const payload = verifyRefresh(refreshToken) as { username: string };
    const newAccess = signAccess({ username: payload.username });
    res.json({ accessToken: newAccess });
  } catch {
    res.status(401).json({ error: "Refresh token expired or invalid" });
  }
};

router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);

export default router;