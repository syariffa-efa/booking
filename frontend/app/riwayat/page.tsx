"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RiwayatPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);

      const res = await api.get("/registrations/riwayat", {
        withCredentials: true,
      });

      setData(res.data || []);
    } catch (err) {
      console.log("Error riwayat:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // CANCEL BOOKING
  const handleCancel = async (id: number) => {
    try {
      await api.put(`/registrations/cancel/${id}`, null, {
        withCredentials: true,
      });

      // refresh data setelah cancel
      fetchRiwayat();

    } catch (err) {
      console.log("Cancel error:", err);
    }
  };

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
    <div className="min-h-screen bg-gray-100 py-6">

      <div className="max-w-4xl mx-auto px-4">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">Riwayat Booking</h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading...</p>
        )}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <div className="bg-white p-6 rounded-xl text-center text-gray-500">
            Belum ada riwayat booking
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">

          {data.map((b) => (
            <div
              key={b.id_registration}
              className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>
                <h2 className="text-lg font-bold text-gray-800">
  {b.schedule?.doctor?.nama_dokter || "Dokter"}
</h2>

<p className="text-sm text-gray-500">
  📅 {b.schedule?.tanggal
    ? new Date(b.schedule.tanggal).toLocaleDateString("id-ID")
    : "-"}
</p>

<p className="text-sm text-gray-500">
  🏥 Ruangan:{" "}
  {b.schedule?.room
    ? `${b.schedule.room.nama_room} - Lantai ${b.schedule.room.lantai}`
    : "-"}
</p>

                  <p className="text-sm text-gray-500">
                    🎫 No Antrian:{" "}
                    <span className="font-semibold text-black">
                      {b.no_antrian}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    🔖 Kode: {b.kode_booking}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`text-white px-3 py-1 rounded-full text-xs font-semibold ${getColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>

              </div>

              {/* RESCHEDULE INFO */}
              {b.status === "RESCHEDULED" && (
                <div className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  ⚠ {b.reschedule_note || "Jadwal telah diubah"}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4">

                {/* LIHAT ANTRIAN */}
<button
  onClick={() =>
    router.push(`/antrian/${b.kode_booking}`)
  }
  disabled={b.status === "CANCELLED"}
  className={`
    px-4 py-2 rounded-lg text-sm transition text-white
    ${
      b.status === "CANCELLED"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
>
  Lihat Antrian
</button>

                {/* CANCEL */}
                <button
                  onClick={() => handleCancel(b.id_registration)}
                  disabled={
                    b.status === "CANCELLED" ||
                    b.status === "COMPLETED"
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition"
                >
                  Cancel
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}