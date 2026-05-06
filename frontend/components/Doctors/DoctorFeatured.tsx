"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DoctorCard from "./DoctorCard";

type Doctor = {
  id_doctor: number;
  nama_dokter: string;
  spesialisasi: string;
  foto: string;
};

export default function DoctorFeatured() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctors/top");
        setDoctors(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        ⭐ Dokter Unggulan
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id_doctor} doc={doc} />
        ))}
      </div>
    </div>
  );
}