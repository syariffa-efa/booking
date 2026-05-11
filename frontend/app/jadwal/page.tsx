"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScheduleService } from "@/lib/service/schedule.service";
import { useScheduleFilter } from "@/lib/hooks/useScheduleFilter";

type ScheduleType = {
  id_schedule: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;

  doctor: {
    id_doctor: number;
    nama_dokter: string;
    spesialisasi: string;
  };

  room: {
    nama_room: string;
    lantai: number;
  };
};

/* FORMAT JAM */
const formatJam = (value?: string) => {
  if (!value) return "-";

  if (value.includes("T")) {
    return value.split("T")[1].slice(0, 5);
  }

  return value.slice(0, 5);
};

export default function JadwalPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);

  const {register,watch,reset,} = useScheduleFilter();
  const search = watch("search");
  const tanggal = watch("tanggal");

  /* TOTAL PAGE */
  const totalPage = Math.ceil(
    total / limit
  );

  /* FETCH */
  const fetchSchedule = async () => {
    try {
      setLoading(true);

      const res =
        await ScheduleService.getAll({
          search,
          tanggal,
          page,
          limit,
        });

      setSchedules(
        res?.data?.schedules || []
      );

      setTotal(
        res?.data?.total || 0
      );

    } catch (err) {
      console.log(
        "Fetch schedule error:",
        err
      );

      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [search, tanggal, page]);

  /* RESET PAGE SAAT FILTER */
  useEffect(() => {
    setPage(1);
  }, [search, tanggal]);

  /* GROUPING */
  const groupedSchedules =
    schedules.reduce(
      (
        acc: Record<
          number,
          {
            doctor:
              ScheduleType["doctor"];
            schedules:
              ScheduleType[];
          }
        >,
        item
      ) => {
        const doctorId =
          item.doctor?.id_doctor;

        if (!doctorId) return acc;

        if (!acc[doctorId]) {
          acc[doctorId] = {
            doctor: item.doctor,
            schedules: [],
          };
        }

        acc[
          doctorId
        ].schedules.push(item);

        return acc;
      },
      {}
    );

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-6">

      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
            Jadwal Dokter
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Cari jadwal konsultasi dokter
          </p>

        </div>

        {/* FILTER */}
        <div className="bg-white rounded-3xl p-4 shadow-md mb-6">

          <div className="grid md:grid-cols-[1fr_220px_120px] gap-3">

            {/* SEARCH */}
            <input
              {...register("search")}
              placeholder="Cari dokter / spesialis"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />

            {/* TANGGAL */}
            <input
              type="date"
              {...register("tanggal")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />

            {/* RESET */}
            <button
              type="button"
              onClick={() => {
                reset();
                setPage(1);
              }}
              className="rounded-2xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition"
            >
              Reset
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 shadow">
            Loading...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          schedules.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center text-slate-500 shadow">
              Jadwal tidak ditemukan
            </div>
          )}

        {/* LIST */}
        {!loading &&
          schedules.length > 0 && (
            <>
              <div className="space-y-4">

                {Object.values(
                  groupedSchedules
                ).map((group) => (
                  <div
                    key={
                      group.doctor
                        .id_doctor
                    }
                    className="bg-white rounded-3xl p-5 shadow-md"
                  >

                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-lg font-bold text-slate-800">
                          {
                            group.doctor
                              .nama_dokter
                          }
                        </h2>

                        <p className="text-sm text-slate-500">
                          {
                            group.doctor
                              .spesialisasi
                          }
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs text-slate-400">
                          Total Jadwal
                        </p>

                        <p className="font-bold text-blue-600">
                          {
                            group
                              .schedules
                              .length
                          }
                        </p>

                      </div>

                    </div>

                    {/* JADWAL */}
                    <div className="flex flex-wrap gap-3 mt-5">

                      {group.schedules.map(
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
                            className="rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all p-4 text-left min-w-[220px]"
                          >

                            <p className="text-sm font-semibold text-slate-700">
                              📅{" "}
                              {new Date(
                                item.tanggal
                              ).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )}
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                              ⏰{" "}
                              {formatJam(
                                item.jam_mulai
                              )}{" "}
                              -{" "}
                              {formatJam(
                                item.jam_selesai
                              )}
                            </p>

                            <p className="text-xs text-slate-500 mt-2">
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

                            <div className="mt-3 inline-flex px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                              Pilih
                            </div>

                          </button>
                        )
                      )}

                    </div>

                  </div>
                ))}

              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((prev) =>
                      prev - 1
                    )
                  }
                  className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40"
                >
                  Prev
                </button>

                {/* NUMBER */}
                {Array.from({
                  length: totalPage,
                }).map((_, index) => {
                  const pageNumber =
                    index + 1;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                        page ===
                        pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-white border"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* NEXT */}
                <button
                  disabled={
                    page === totalPage
                  }
                  onClick={() =>
                    setPage((prev) =>
                      prev + 1
                    )
                  }
                  className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            </>
          )}

      </div>

    </div>
  );
}