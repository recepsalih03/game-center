import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { users } from "../../../config/users";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const loginHandler: RequestHandler = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const hash = createHash("sha256").update(password).digest("hex");
    if (hash !== user.passwordHash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { email: user.email } });
  } catch (err) {
    next(err);
  }
};

router.post("/login", loginHandler);

export default router;