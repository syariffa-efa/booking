"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function JadwalPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 6;

  const fetchData = async (customPage = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/api/schedule", {
        params: {
          search,
          tanggal,
          page: customPage,
          limit,
        },
      });

      setData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchData(1);
  };

  const handleReset = () => {
    setSearch("");
    setTanggal("");
    setPage(1);
    fetchData(1);
  };

  const totalPage = Math.ceil(total / limit);

  const groupedData = useMemo(() => {
    const group: any = {};

    data.forEach((item) => {
      const doctorId = item.doctor.id_doctor;

      if (!group[doctorId]) {
        group[doctorId] = {
          doctor: item.doctor,
          schedules: [],
        };
      }

      group[doctorId].schedules.push(item);
    });

    return group;
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Jadwal Dokter Terdekat</h1>
          <p className="text-gray-500">Cari dan pilih jadwal dokter</p>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari dokter / spesialis..."
            className="flex-1 border p-2 rounded-lg"
          />

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="border p-2 rounded-lg"
          />

          <button
            onClick={handleReset}
            className="bg-gray-200 px-4 rounded-lg"
          >
            Reset
          </button>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded-lg"
          >
            Cari
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : Object.keys(groupedData).length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            Tidak ada jadwal ditemukan
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {Object.values(groupedData).map((group: any) => (
              <div
                key={group.doctor.id_doctor}
                className="bg-white p-5 rounded-xl shadow border"
              >
                {/* DOCTOR INFO */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">
                      {group.doctor.nama_dokter}, {group.doctor.gelar}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {group.doctor.spesialisasi}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      group.doctor.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {group.doctor.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* SCHEDULE LIST */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">

                  {group.schedules.map((item: any) => (
                    <div
                      key={item.id_schedule}
                      className="p-2 rounded border bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        🗓 {new Date(item.tanggal).toLocaleDateString("id-ID")}{" "}
                        ⏰ {item.jam_mulai.slice(11, 16)} -{" "}
                        {item.jam_selesai.slice(11, 16)}
                      </div>

                      {/* BOOK BUTTON */}
                      <button
                        onClick={() =>
                          router.push(`/booking/${item.id_schedule}`)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Pilih
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            ))}

          </div>
        )}

        {/* PAGINATION */}
        {totalPage > 1 && (
          <div className="flex justify-center mt-10 gap-2">

            {Array.from({ length: totalPage }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPage(i + 1);
                  fetchData(i + 1);
                }}
                className={`w-9 h-9 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}