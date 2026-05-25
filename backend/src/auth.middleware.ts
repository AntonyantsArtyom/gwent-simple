import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "./auth.store.js";

const JWT_SECRET = "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  userId?: string;
  userLogin?: string;
}

export function generateToken(userId: string, login: string): string {
  return jwt.sign({ userId, login }, JWT_SECRET, { expiresIn: "24h" });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    res.status(401).json({ message: "Token error" });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ message: "Token malformatted" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      login: string;
    };

    const user = getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.userId = decoded.userId;
    req.userLogin = decoded.login;

    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
