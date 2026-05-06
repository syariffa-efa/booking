"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function JadwalPage() {
  const { id } = useParams();
  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/jadwal/doctor/${id}`);
        setJadwal(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [id]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Jadwal Dokter
      </h1>

      {jadwal.map((j) => (
        <div key={j.id_schedule} className="bg-white p-4 mb-3 rounded shadow">
          <p>{j.tanggal}</p>
          <p>{j.jam_mulai} - {j.jam_selesai}</p>
        </div>
      ))}
    </div>
  );
}