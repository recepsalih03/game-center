import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }

  try {
    const payload = verifyAccess(token) as any;
    (req as any).user = { email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Token invalid or expired" });
    return;
  }
}