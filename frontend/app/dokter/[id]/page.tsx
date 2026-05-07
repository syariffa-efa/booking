"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function DoctorPage() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState<any>(null);
  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // ambil detail dokter
        const resDoctor = await api.get(`/api/doctors/${id}`);
        setDoctor(resDoctor.data.data);

        // ambil jadwal dokter
        const resJadwal = await api.get(`/api/doctor/${id}`);
        setJadwal(resJadwal.data.data || []);
        console.log("ID:", id);
console.log("DOCTOR RES:", resDoctor.data);
console.log("JADWAL RES:", resJadwal.data);
      } catch (err) {
        console.log(err);
        
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-6">
      {/* HEADER DOKTER */}
      <h1 className="text-xl font-bold">
        {doctor?.nama_dokter || "Loading..."}
      </h1>

      <p className="text-gray-500 mb-4">
        {doctor?.spesialisasi}
      </p>

      {/* JADWAL */}
      <h2 className="font-semibold mb-2">
        Jadwal Praktik
      </h2>

      {jadwal.length === 0 ? (
        <p>Tidak ada jadwal</p>
      ) : (
        jadwal.map((j: any) => (
          <div
            key={j.id}
            className="border p-3 rounded mb-2"
          >
            <div>{j.hari}</div>
            <div>
              {j.jam_mulai} - {j.jam_selesai}
            </div>
          </div>
        ))
      )}
    </div>
  );
}