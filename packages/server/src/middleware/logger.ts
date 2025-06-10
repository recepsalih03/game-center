import { Request, Response, NextFunction } from "express";

export function logger(req: Request, _res: Response, next: NextFunction) {
  next();
}