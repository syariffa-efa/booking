import { api } from "@/lib/api";

export const RiwayatService = {
  getAll: () =>
    api.get("/registrations/riwayat", {
      withCredentials: true,
    }),

  cancel: (id: number) =>
    api.put(`/registrations/cancel/${id}`, null, {
      withCredentials: true,
    }),
};