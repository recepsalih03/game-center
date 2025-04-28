import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    (req as any).user = { email: payload.email };
    next();
  } catch (e) {
    const err = new Error("Token invalid or expired");
    (err as any).status = 401;
    next(err);
  }
}