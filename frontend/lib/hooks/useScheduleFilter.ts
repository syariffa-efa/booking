import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================= SCHEMA ================= */
const scheduleFilterSchema = z.object({
  search: z.string(),
  tanggal: z.string(),
});

/* ================= TYPE ================= */
export type ScheduleFilterType = z.infer<
    typeof scheduleFilterSchema
  >;

/* ================= HOOK ================= */
export const useScheduleFilter =
  () => {
    return useForm<
      ScheduleFilterType
    >({
      resolver: zodResolver(
        scheduleFilterSchema
      ),

      defaultValues: {
        search: "",
        tanggal: "",
      },
    });
  };