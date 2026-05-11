"use client";

import { useRiwayat } from "@/lib/hooks/use.Riwayat";
import RiwayatCard from "@/components/riwayat/riwayatcard";

export default function RiwayatPage() {
  const { data, loading, cancelBooking } = useRiwayat();

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">
          Riwayat Booking
        </h1>

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
          {data.map((item) => (
            <RiwayatCard
              key={item.id_registration}
              data={item}
              onCancel={cancelBooking}
            />
          ))}
        </div>

      </div>
    </div>
  );
}