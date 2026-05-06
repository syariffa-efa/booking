"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RiwayatPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await api.get("/registrations/riwayat");
        console.log("RESPON:", res.data);
        setData(res.data || []);

      } catch (err) {
        console.log("Error riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-500";
      case "RESCHEDULED":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 p-4 space-y-4">

        <h1 className="text-xl font-bold">Riwayat Booking</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat booking</p>
        ) : (
          data.map((b) => (
            <div
              key={b.id_registration}
              className="bg-white border rounded-xl p-4 shadow"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="font-bold">
                    {b.schedule?.doctor?.name || "Dokter"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {b.schedule?.date}
                  </p>

                  <p className="text-sm">
                    No Antrian: {b.no_antrian}
                  </p>
                </div>

                <span
                  className={`text-white px-3 py-1 rounded text-xs ${getColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>

              </div>

              {/* RESCHEDULE INFO */}
              {b.status === "RESCHEDULED" && (
                <div className="mt-2 text-sm text-yellow-600">
                  ⚠ {b.reschedule_note || "Jadwal telah diubah"}
                </div>
              )}

              <div className="flex gap-2 mt-3">

                <button
                  onClick={() =>
                    router.push(`/antrian/${b.kode_booking}`)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Lihat Antrian
                </button>

                <button
                  disabled={
                    b.status === "CANCELLED" ||
                    b.status === "COMPLETED"
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>
            </div>
          ))
        )}

      </main>

    </div>
  );
}