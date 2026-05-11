import { z } from "zod";

export const scheduleFilterSchema = z.object({
  search: z.string(),
  tanggal: z.string(),
});

export type ScheduleFilterType = z.infer<
  typeof scheduleFilterSchema
>;