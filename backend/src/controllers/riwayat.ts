import type { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {successResponse,error,} from "../shared/helpers/response";

// Bikin status booking
const registrations_status = {
  BOOKED: "BOOKED",
  RESCHEDULE: "RESCHEDULE",
  CANCELLED: "CANCELLED",
  COMPLETE: "COMPLETED",
};

// BIKIN HISTORY BOOKING
export const getBookingHistory = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return error(
        res,
        "Unauthorized",
        401
      );
    }

    const data =
      await prisma.registrations.findMany({
        include: {
          patient: true,
          schedule: {
            include: {
              doctor: true,
              room: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

    return successResponse(
      res,
      "Berhasil mengambil riwayat booking",
      data
    );

  } catch (err) {
    console.error(err);

    return error(
      res,
      "Internal server error",
      500
    );
  }
};

// cancel booking
export const cancelBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { id_registration } = req.params;

    const booking =
      await prisma.registrations.findUnique({
        where: {
          id_registration: Number(
            id_registration
          ),
        },
      });

    if (!booking) {
      return error(
        res,
        "Booking tidak ditemukan",
        404
      );
    }

    const updated =
      await prisma.registrations.update({
        where: {
          id_registration: Number(
            id_registration
          ),
        },
        data: {
          status:
            registrations_status.CANCELLED,
        },
      });

    return successResponse(
      res,
      "Booking berhasil dibatalkan",
      updated
    );

  } catch (err) {
    console.error(err);

    return error(
      res,
      "Internal server error",
      500
    );
  }
};