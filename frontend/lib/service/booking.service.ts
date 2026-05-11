import { api } from "@/lib/api";

export const BookingService = {
  getSchedule: (id: string | number) =>
    api.get(`/api/schedule/${id}`),

  checkBPJS: (no_bpjs: string) =>
    api.post("/api/insurance/check-bpjs", { no_bpjs }),

  createBooking: (payload: any) =>
    api.post("/api/booking", payload),
};