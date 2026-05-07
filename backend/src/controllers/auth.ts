import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../prisma";
import { successResponse, error } from "../../utils/response";

const JWT_SECRET = "SECRET_KEY";

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { nama, email, password, no_hp } = req.body;

    // cek email duplikat
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return error(res, "Email sudah terdaftar");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        uid: uuidv4(),
        nama_lengkap: nama,
        email,
        password: hashed,
        no_hp,
        role: "user",
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
  } catch (err) {
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

    if (!user) {
      return error(res, "Email tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return error(res, "Password salah");
    }

    const token = jwt.sign(
      { id: user.id_users, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id_users,
          nama: user.nama_lengkap,
          role: user.role,
        },
      },
    });
  } catch (err) {
    return error(res, "Login gagal");
  }
};