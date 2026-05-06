import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../prisma";
import { successResponse, error } from "../../utils/response";

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { nama, email, password, no_hp } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        uid: uuidv4(),
        nama_lengkap: nama,
        email,
        password: hashed,
        no_hp,
        role: "user", // default role
      },
      select: {
        id_users: true,
        uid: true,
        nama_lengkap: true,
        email: true,
        role: true,
      },
    });

    return successResponse(res, "Register berhasil", user);
  } catch (err: any) {
    console.log(err);
    return error(res, "Gagal register");
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) return error(res, "User tidak ditemukan", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, "Password salah", 401);

    const token = jwt.sign(
      {
        id: user.id_users,
        uid: user.uid,
        role: user.role,
      },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    return successResponse(res, "Login berhasil", {
      token,
      user: {
        id: user.id_users,
        uid: user.uid,
        nama: user.nama_lengkap,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return error(res, "Gagal login");
  }
};