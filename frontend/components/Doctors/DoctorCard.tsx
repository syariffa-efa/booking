"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type Doctor = {
  id_doctor: number;
  nama_dokter: string;
  spesialisasi: string;
  foto: string;
};

export default function DoctorCard({ doc }: { doc: Doctor }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white shadow rounded-xl p-3 transition-all duration-200 cursor-pointer hover:shadow-xl"
    >
      <img
        src={`/doctors/${doc.foto}`}
        className="h-[150px] w-full object-cover rounded-lg"
      />

      <p className="font-semibold mt-2">
        {doc.nama_dokter}
      </p>

      <p className="text-sm text-gray-500">
        {doc.spesialisasi}
      </p>

      <button
        onClick={() => router.push(`/dokter/${doc.id_doctor}`)}
        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
      >
        Lihat Jadwal
      </button>
    </div>
  );
}