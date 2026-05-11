import type { Request, Response } from "express";
import { registerUser, loginUser } from "../modules/auth.service";
import { successResponse, error } from "../shared/helpers/response";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    return successResponse(res, "Register berhasil", user);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
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
  } catch (err: any) {
    return error(res, err.message);
  }
};