import type { Request, Response } from "express";

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
      return res.status(400).json({
        success: false,
        message: "Nomor BPJS wajib diisi",
      });
    }


    // aturan sederhana:
    // - harus 13 digit
    // - kalau mulai dengan "00" → aktif
    // - selain itu tidak aktif

    const isValidLength = no_bpjs.length === 13;
    const isActive = isValidLength && no_bpjs.startsWith("00");

    if (!isValidLength) {
      return res.status(400).json({
        success: false,
        status: "INVALID",
        message: "Nomor BPJS tidak valid",
      });
    }

    if (!isActive) {
      return res.status(200).json({
        success: true,
        status: "INACTIVE",
        message: "BPJS tidak aktif",
      });
    }

    return res.status(200).json({
      success: true,
      status: "ACTIVE",
      message: "BPJS aktif",
      data: {
        nama: "Peserta BPJS",
        kelas: "Kelas 1",
        faskes: "RS Default",
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};