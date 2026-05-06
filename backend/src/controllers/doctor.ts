import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ALL
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { is_active: true }
    });

    res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//TOP 5

export const getTopDoctors = async (req:Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        id_doctor: {
          lte: 5, 
        },
      },
      take: 5,
      orderBy: {
        id_doctor: 'asc',
      },
    });

    res.json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'Gagal ambil dokter',
    });
  }
};