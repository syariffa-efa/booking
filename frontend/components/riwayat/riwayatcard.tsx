"use client";

import { useRouter } from "next/navigation";

type Props = {
  data: any;
  onCancel: (id: number) => void;
};

export default function RiwayatCard({ data, onCancel }: Props) {
  const router = useRouter();

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
    <div className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {data.schedule?.doctor?.nama_dokter || "Dokter"}
          </h2>

          <p className="text-sm text-gray-500">
            📅 {data.schedule?.tanggal
              ? new Date(data.schedule.tanggal).toLocaleDateString("id-ID")
              : "-"}
          </p>

          <p className="text-sm text-gray-500">
            🏥 Ruangan:{" "}
            {data.schedule?.room
              ? `${data.schedule.room.nama_room} - Lantai ${data.schedule.room.lantai}`
              : "-"}
          </p>

          <p className="text-sm text-gray-500">
            🎫 No Antrian:{" "}
            <span className="font-semibold text-black">
              {data.no_antrian}
            </span>
          </p>

          <p className="text-sm text-gray-500">
            🔖 Kode: {data.kode_booking}
          </p>
        </div>

        {/* STATUS */}
        <span className={`text-white px-3 py-1 rounded-full text-xs font-semibold ${getColor(data.status)}`}>
          {data.status}
        </span>

      </div>

      {/* ACTION */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={() => router.push(`/antrian/${data.kode_booking}`)}
          disabled={data.status === "CANCELLED"}
          className={`px-4 py-2 rounded-lg text-sm text-white ${
            data.status === "CANCELLED"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Lihat Antrian
        </button>

        <button
          onClick={() => onCancel(data.id_registration)}
          disabled={
            data.status === "CANCELLED" ||
            data.status === "COMPLETED"
          }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}