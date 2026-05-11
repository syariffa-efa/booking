import type { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { nanoid } from "nanoid";
import {successResponse,error,} from "../shared/helpers/response";

type BookingBody = {
  scheduleId: number;
  keluhan?: string;
  id_insurance?: number;
  no_bpjs?: string;
  patient: {
    nama_lengkap: string;
    no_hp: string;
    nik: string;
    ttl: string;
    jenis_kelamin: string;
    alamat: string;
  };
};

export const createBooking = async (
  req: Request<{}, {}, BookingBody>,
  res: Response
) => {
  try {
    const {
      scheduleId,
      patient,
      keluhan,
      id_insurance,
      no_bpjs,
    } = req.body;

    // VALIDASI INPUT
      if (!scheduleId || !patient) {
        return error(
          res,
          "Data tidak lengkap",
          400
        );
      }

  // AMBIL SCHEDULE
    const schedule = await prisma.schedule.findUnique({
      where: { id_schedule: scheduleId },
      include: {
        doctor: true,
        room: true,
      },
    });
    // VALIDASI SCHEDULE
    if (!schedule || !schedule.doctor || !schedule.tanggal) {
      return error(
        res,
        "Schedule tidak valid",
        404
      );
    }

    // HITUNG ANTRIAN HARI INI
    const tanggal = new Date(schedule.tanggal);
    const start = new Date(tanggal);
    start.setHours(0, 0, 0, 0);

    const end = new Date(tanggal);
    end.setHours(23, 59, 59, 999);

    const totalAntrian = await prisma.registrations.count({
      where: {
        id_schedule: scheduleId,
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });

    // CEK KUOTA
    const kuota =
      id_insurance === 2
        ? schedule.kuota_bpjs
        : schedule.kuota_umum;

    // VALIDASI CEK KUOTA
        if (kuota !== null && totalAntrian >= kuota) {
          return error(
            res,
            "Kuota penuh",
            400
          );
        }

    const nomorUrut = totalAntrian + 1;

   // NOMOR ANTRIAN
    const initials = schedule.doctor.nama_dokter
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const nomorFormatted = String(nomorUrut).padStart(3, "0");
    const nomor_antrian = `${initials}A${nomorFormatted}`;

    // BIKIN KODE BOOKING 
    const yyyy = tanggal.getFullYear();
    const mm = String(tanggal.getMonth() + 1).padStart(2, "0");
    const dd = String(tanggal.getDate()).padStart(2, "0");

    // DITAMBAH INISIAL DOKTER
    const dokterKode = schedule.doctor.nama_dokter
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // DAN HURUF RANDOM DR NANOID
    const randomCode = nanoid(4).toUpperCase();
    // HASIL AKHIR
    const kode_booking =
      `${dokterKode}-${yyyy}${mm}${dd}-${randomCode}`;

    // CEK PATIENT
    const existingPatient = await prisma.patient.findFirst({
      where: { nik: patient.nik },
    });

    const newPatient =
      existingPatient ??
      (await prisma.patient.create({
        data: patient,
      }));

   // CREATE BOOKING
    const booking = await prisma.registrations.create({
      data: {
        id_patient: newPatient.id_patient,
        id_schedule: scheduleId,
        id_insurance: id_insurance || null,
        no_bpjs: no_bpjs || null,
        no_antrian: nomor_antrian,
        kode_booking,
        status: "BOOKED",
        keluhan: keluhan || null,
      },
      include: {
        patient: true,
        schedule: {
          include: {
            doctor: true,
            room: true,
          },
        },
      },
    });

    // CREATE ANTRIAN
    await prisma.antrian.create({
      data: {
        id_registration: booking.id_registration,
        status_antrian: "BOOKED",
        waktu_ambil: new Date(),
      },
    });

   // RESPONSE
    return successResponse(
      res,
      "Booking berhasil",
      booking
    );

  } catch (err) {
    console.error("CREATE_BOOKING_ERROR:", err);
  
    return error(
      res,
      "Internal server error",
      500
    );
  }
};