import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const registerUser = async (data: any) => {
  const existingUser = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.users.create({
    data: {
      uid: uuidv4(),
      nama_lengkap: data.nama,
      email: data.email,
      password: hashed,
      no_hp: data.no_hp,
      role: "user",
    },
  });

  return user;
};

export const loginUser = async (data: any) => {
  const user = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Email tidak ditemukan");

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new Error("Password salah");

  const token = jwt.sign(
    { id: user.id_users, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
};