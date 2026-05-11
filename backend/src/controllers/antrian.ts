import type { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { successResponse,error,} from "../shared/helpers/response";

export const getBookingByCode = async (
  req: Request,
  res: Response
) => {
  try {
    let kode = req.params.kode;

    kode = Array.isArray(kode)
      ? kode[0]
      : kode;

    if (!kode) {
      return error(
        res,
        "Kode booking tidak valid",
        400
      );
    }

    const booking =
      await prisma.registrations.findFirst({
        where: {
          kode_booking: {
            equals: kode.trim(),
            mode: "insensitive",
          },
        },
        include: {
          patient: true,
          schedule: {
            include: {
              doctor: true,
              room: true,
            },
          },
          antrian: true,
        },
      });

    if (!booking) {
      return error(
        res,
        "Booking tidak ditemukan",
        404
      );
    }

    /* FLOW */
    const antrian = booking.antrian?.[0];

    const flow = {
      booked: !!booking.created_at,
      admisi: !!antrian?.waktu_admis,
      poli: !!antrian?.waktu_poli,
      kasir: !!antrian?.waktu_kasir,
      farmasi: !!antrian?.waktu_farmasi,
    };

    /* PESERTA DILAYANI */
    const peserta_dilayani =
      await prisma.registrations.count({
        where: {
          id_schedule:
            booking.id_schedule,
          status: "BOOKED",
        },
      });

    return successResponse(
      res,
      "Berhasil ambil data antrian",
      {
        ...booking,
        flow,
        peserta_dilayani,
      }
    );
  } catch (err) {
    console.error(
      "GET_ANTRIAN_ERROR:",
      err
    );

    return error(
      res,
      "Server error"
    );
  }
};