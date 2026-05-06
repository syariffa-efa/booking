import type { Request, Response } from "express";
import { prisma } from "../prisma";

export const getAllSchedule = async (req: Request, res: Response) => {
    try {
      const {
        search = "",
        tanggal,
        page = "1",
        limit = "6",
      } = req.query;
  
      const skip = (Number(page) - 1) * Number(limit);
  
      const where: any = {};
  
      // FILTER TANGGAL
      if (tanggal) {
        where.tanggal = new Date(tanggal as string);
      }
  
      // FILTER SEARCH 
      if (search && search !== "") {
        where.doctor = {
          OR: [
            {
              nama_dokter: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              spesialisasi: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          ],
        };
      }
  
      const schedules = await prisma.schedule.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          doctor: true,
          room: true,
        },
        orderBy: {
          tanggal: "asc",
        },
      });
  
      const total = await prisma.schedule.count({
        where,
      });
  
      return res.json({
        success: true,
        data: schedules,
        total,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Gagal ambil jadwal",
      });
    }
  };

  export const getScheduleByDoctor = async (req: Request, res: Response) => {
    try {
      const { doctorId } = req.params;
  
      const schedules = await prisma.schedule.findMany({
        where: {
          id_doctor: Number(doctorId),
        },
        include: {
          doctor: true,
          room: true, 
        },
      });
  
      res.json({
        success: true,
        data: schedules,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "Gagal ambil jadwal dokter",
      });
    }
  };

  export const getScheduleById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const schedule = await prisma.schedule.findUnique({
        where: {
          id_schedule: Number(id),
        },
        include: {
          doctor: true,
          room: true,
        },
      });
  
      if (!schedule) {
        return res.json({
          success: false,
          data: null,
        });
      }
  
      res.json({
        success: true,
        data: schedule,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "Gagal ambil schedule",
      });
    }
  };