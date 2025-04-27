import { Request, Response, NextFunction } from "express";

const DEMO_TOKEN = "demo-secret-token";

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (token === DEMO_TOKEN) {
    (req as any).user = { email: "employee@example.com" };
    return next();
  }

  const err = new Error("Unauthorized");
  (err as any).status = 401;
  return next(err);
}