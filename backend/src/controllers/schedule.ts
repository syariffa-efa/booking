import type { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {successResponse,error,} from "../shared/helpers/response";

/* ================= GET ALL ================= */
export const getAllSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search = "",
      tanggal,
      page = "1",
      limit = "6",
    } = req.query;

    const where: any = {};

    /* FILTER TANGGAL */
    if (tanggal) {
      where.tanggal = new Date(
        tanggal as string
      );
    }

    /* FILTER SEARCH */
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

    /* AMBIL SEMUA SCHEDULE */
    const allSchedules =
      await prisma.schedule.findMany({
        where,
        include: {
          doctor: true,
          room: true,
        },
        orderBy: {
          tanggal: "asc",
        },
      });

    /* GROUP DOKTER */
    const groupedDoctors = Object.values(
      allSchedules.reduce(
        (acc: any, item: any) => {
          const doctorId =
            item.doctor.id_doctor;

          if (!acc[doctorId]) {
            acc[doctorId] = [];
          }

          acc[doctorId].push(item);

          return acc;
        },
        {}
      )
    );

    /* PAGINATION PER DOKTER */
    const currentPage = Number(page);
    const currentLimit =
      Number(limit);

    const start =
      (currentPage - 1) *
      currentLimit;

    const paginatedDoctors =
      groupedDoctors.slice(
        start,
        start + currentLimit
      );

    /* FLATTEN */
    const schedules =
      paginatedDoctors.flat();

    return successResponse(
      res,
      "Berhasil ambil jadwal",
      {
        schedules,
        total:
          groupedDoctors.length,
      }
    );
  } catch (err) {
    console.log(err);

    return error(
      res,
      "Gagal ambil jadwal"
    );
  }
};

/* ================= GET BY DOCTOR ================= */
export const getScheduleByDoctor =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { doctorId } =
        req.params;

      const schedules =
        await prisma.schedule.findMany({
          where: {
            id_doctor:
              Number(doctorId),
          },
          include: {
            doctor: true,
            room: true,
          },
        });

      return successResponse(
        res,
        "Berhasil ambil jadwal dokter",
        schedules
      );
    } catch (err) {
      console.log(err);

      return error(
        res,
        "Gagal ambil jadwal dokter"
      );
    }
  };

/* ================= GET BY ID ================= */
export const getScheduleById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const schedule =
      await prisma.schedule.findUnique({
        where: {
          id_schedule:
            Number(id),
        },
        include: {
          doctor: true,
          room: true,
        },
      });

    if (!schedule) {
      return error(
        res,
        "Schedule tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Berhasil ambil schedule",
      schedule
    );
  } catch (err) {
    console.log(err);

    return error(
      res,
      "Gagal ambil schedule"
    );
  }
};