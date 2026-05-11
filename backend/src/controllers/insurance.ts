import type { Request, Response } from "express";
import {successResponse,error,} from "../shared/helpers/response";

type CheckBPJSBody = {
  no_bpjs: string;
};

export const checkBPJS = async (
  req: Request<{}, {}, CheckBPJSBody>,
  res: Response
) => {
  try {
    const { no_bpjs } = req.body;

    if (!no_bpjs) {
      return error(
        res,
        "Nomor BPJS wajib diisi",
        400
      );
    }

    // aturan sederhana:
    // - harus 13 digit
    // - kalau mulai dengan "00" → aktif
    // - selain itu tidak aktif

    const isValidLength =
      no_bpjs.length === 13;

    const isActive =
      isValidLength &&
      no_bpjs.startsWith("00");

    if (!isValidLength) {
      return error(
        res,
        "Nomor BPJS tidak valid",
        400
      );
    }

    if (!isActive) {
      return successResponse(
        res,
        "BPJS tidak aktif",
        {
          status: "INACTIVE",
        }
      );
    }

    return successResponse(
      res,
      "BPJS aktif",
      {
        status: "ACTIVE",
        nama: "Peserta BPJS",
        kelas: "Kelas 1",
        faskes: "RS Default",
      }
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