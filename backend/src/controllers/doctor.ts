import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {successResponse,error,} from "../shared/helpers/response";

const prisma = new PrismaClient();

// ALL
export const getAllDoctors = async (
  req: Request,
  res: Response
) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { is_active: true },
    });

    return successResponse(
      res,
      "Berhasil mengambil data dokter",
      doctors
    );

  } catch (err) {
    console.error(err);

    return error(
      res,
      "Gagal mengambil data dokter",
      500
    );
  }
};

// TOP 5
export const getTopDoctors = async (
  req: Request,
  res: Response
) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        id_doctor: {
          lte: 5,
        },
      },
      take: 5,
      orderBy: {
        id_doctor: "asc",
      },
    });

    return successResponse(
      res,
      "Berhasil mengambil top dokter",
      doctors
    );

  } catch (err) {
    console.error(err);

    return error(
      res,
      "Gagal ambil dokter",
      500
    );
  }
};
