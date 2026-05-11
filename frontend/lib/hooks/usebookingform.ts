import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {bookingSchema,BookingFormType,} from "@/lib/validation/booking.schema";

export const useBookingForm = () => {
  return useForm<BookingFormType>({
    resolver: zodResolver(bookingSchema),

    defaultValues: {
      nama_lengkap: "",
      no_hp: "",
      nik: "",
      ttl: "",
      jenis_kelamin: "L",
      alamat: "",
      keluhan: "",
      id_insurance: "",
      no_bpjs: "",
    },
  });
};