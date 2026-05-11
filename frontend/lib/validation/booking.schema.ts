import { z } from "zod";

export const bookingSchema = z.object({
  nama_lengkap: z
    .string()
    .min(3, "Nama minimal 3 karakter"),

  no_hp: z
    .string()
    .min(11, "No HP tidak valid"),

  nik: z
    .string()
    .length(16, "NIK harus 16 digit"),

  ttl: z
    .string()
    .min(3, "TTL wajib diisi"),

  jenis_kelamin: z.enum(["L", "P"], {
    message: "Pilih jenis kelamin",
  }),

  alamat: z
    .string()
    .min(5, "Alamat wajib diisi"),

  keluhan: z
    .string()
    .min(3, "Keluhan wajib diisi"),

  id_insurance: z
    .string()
    .min(1, "Pilih pembayaran"),

  no_bpjs: z.string().optional(),
});

export type BookingFormType =
  z.infer<typeof bookingSchema>;