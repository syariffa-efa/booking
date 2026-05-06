import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, "SECRET_KEY");

    // SIMPAN USER DI REQUEST
    req.user = decoded;

    // =========================
    // SET COOKIE
    // =========================
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    // LANJUT KE CONTROLLER
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};