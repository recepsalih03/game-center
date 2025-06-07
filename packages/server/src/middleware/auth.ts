import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";
export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

export function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }

  try {
    const payload = verifyAccess(token) as { username: string };
    req.user = { username: payload.username };
    next();
  } catch {
    res.status(401).json({ error: "Token invalid or expired" });
  }
}