import type { Request, Response } from "express";
import { prisma } from "../prisma";

//Bikin status booking
    const registrations_status = {
        BOOKED: "BOOKED",
        RESCHEDULE: "RESCHEDULE",
        CANCELLED: "CANCELLED",
        COMPLETE: "COMPLETED",
      }

// BIKIN HISTORY BOOKING
export const getBookingHistory = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

    const data = await prisma.registrations.findMany({
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
  
    res.json(data);
  };

  //cancel booking
  export const cancelBooking = async (req: Request, res: Response) => {
    const { id_registration } = req.params;
  
    const booking = await prisma.registrations.findUnique({
      where: { id_registration: Number(id_registration) },
    });
  
    if (!booking) {
        return res.status(404).json({ message: "Booking tidak ditemukan" });
      }
  
    const updated = await prisma.registrations.update({
      where: { id_registration: Number(id_registration) },
      data: {
        status: "CANCELLED",
      },
    });
  
    res.json(updated);
  };
     