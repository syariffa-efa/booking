import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};