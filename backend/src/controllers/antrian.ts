import type { Request, Response } from "express";
import { prisma } from "../prisma";

export const getBookingByCode = async (req: Request, res: Response) => {
  try {
    let kode = req.params.kode;
    kode = Array.isArray(kode) ? kode[0] : kode;
    console.log("KODE PARAM:", kode);

    if (!kode) {
      return res.status(400).json({
        success: false,
        message: "Kode booking tidak valid",
      });
    }

    const booking = await prisma.registrations.findFirst({
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

    console.log("BOOKING RESULT:", booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking tidak ditemukan",
      });
    }

    const antrian = booking.antrian?.[0];

    const flow = {
      booked: !!booking.created_at,
      admisi: !!antrian?.waktu_admis,
      poli: !!antrian?.waktu_poli,
      kasir: !!antrian?.waktu_kasir,
      farmasi: !!antrian?.waktu_farmasi,
    };

    const peserta_dilayani = await prisma.registrations.count({
      where: {
        id_schedule: booking.id_schedule,
        status: "DONE",
      },
    });

    return res.json({
      success: true,
      data: {
        ...booking,
        flow,
        peserta_dilayani,
      },
    });

  } catch (err) {
    console.error("GET_ANTRIAN_ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};