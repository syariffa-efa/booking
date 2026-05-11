"use client";

import {useEffect,useState,} from "react";
import {useParams,useRouter,} from "next/navigation";
import { api } from "@/lib/api";

type ScheduleType = {
  id_schedule: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;

  doctor: {
    nama_dokter: string;
    spesialisasi: string;
  };

  room: {
    nama_room: string;
    lantai: number;
  };
};

const formatJam = (
  value?: string
) => {
  if (!value) return "-";

  if (value.includes("T")) {
    return value
      .split("T")[1]
      .slice(0, 5);
  }

  return value.slice(0, 5);
};

export default function DoctorDetailPage() {
  const router = useRouter();

  const { id } = useParams<{
    id: string;
  }>();

  const [schedules, setSchedules] =
    useState<ScheduleType[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSchedule =
      async () => {
        try {
          setLoading(true);

          const res =
            await api.get(
              `/api/schedule/doctor/${id}`
            );

          setSchedules(
            res.data.data || []
          );
        } catch (err) {
          console.log(
            "FETCH_SCHEDULE_ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchSchedule();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Jadwal dokter tidak ditemukan
      </div>
    );
  }

  const doctor =
    schedules[0]?.doctor;

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-6">

      <div className="max-w-5xl mx-auto px-4">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">

          <h1 className="text-3xl font-black text-slate-800">
            {doctor?.nama_dokter}
          </h1>

          <p className="text-slate-500 mt-1">
            {
              doctor?.spesialisasi
            }
          </p>

        </div>

        {/* LIST JADWAL */}
        <div className="grid md:grid-cols-2 gap-4">

          {schedules.map(
            (item) => (
              <button
                key={
                  item.id_schedule
                }
                onClick={() =>
                  router.push(
                    `/booking/${item.id_schedule}`
                  )
                }
                className="bg-white rounded-3xl p-5 shadow-md text-left hover:shadow-lg transition"
              >

                <p className="font-bold text-slate-700">
                  📅{" "}
                  {new Date(
                    item.tanggal
                  ).toLocaleDateString(
                    "id-ID"
                  )}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  ⏰{" "}
                  {formatJam(
                    item.jam_mulai
                  )}{" "}
                  -{" "}
                  {formatJam(
                    item.jam_selesai
                  )}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  🏥{" "}
                  {
                    item.room
                      ?.nama_room
                  }{" "}
                  • Lt.{" "}
                  {
                    item.room
                      ?.lantai
                  }
                </p>

                <div className="mt-4 inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
                  Pilih Jadwal
                </div>

              </button>
            )
          )}

        </div>

      </div>

    </div>
  );
}