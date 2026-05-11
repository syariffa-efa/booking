// lib/service/antrian.service.ts
import { api } from "@/lib/api";

export const AntrianService = {
  getByKode: (kode: string) =>
    api.get(`/api/antrian/${kode}`),
};