import { api } from "@/lib/api";

type FetchScheduleParams = {
  search?: string;
  tanggal?: string;
  page?: number;
  limit?: number;
};

export class ScheduleService {
  static async getAll(
    params: FetchScheduleParams
  ) {
    const res = await api.get(
      "/api/schedule",
      {
        params,
      }
    );

    return res.data;
  }

  static async getById(id: number) {
    const res = await api.get(
      `/api/schedule/${id}`
    );

    return res.data;
  }
}