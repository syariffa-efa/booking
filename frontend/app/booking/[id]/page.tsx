"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { BookingService } from "@/lib/service/booking.service";
import { useBookingForm } from "@/lib/hooks/usebookingform";

/* ================= TYPE ================= */
type ScheduleType = {
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;

  doctor?: {
    nama_dokter: string;
  };

  room?: {
    nama_room: string;
    lantai?: string | number;
  };
};

/* ================= HELPER ================= */
const normalizeId = (
  id: string | string[] | undefined
) => (Array.isArray(id) ? id[0] : id);

/* ================= FORMAT JAM ================= */
const formatJam = (value?: string) => {
  if (!value) return "-";

  if (value.includes("T")) {
    return value.split("T")[1].slice(0, 5);
  }

  return value.slice(0, 5);
};

/* ================= PAGE ================= */
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const id = normalizeId(params?.id);

  const [schedule, setSchedule] =
    useState<ScheduleType | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [bpjsLoading, setBpjsLoading] =
    useState(false);

  const [bpjsStatus, setBpjsStatus] =
    useState<
      "ACTIVE" | "INACTIVE" | null
    >(null);

  /* ================= RHF ================= */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useBookingForm();

  const form = watch();

  /* ================= FETCH SCHEDULE ================= */
  useEffect(() => {
    if (!id) return;

    const fetchSchedule = async () => {
      try {
        const res =
          await BookingService.getSchedule(
            id
          );

        setSchedule(res.data.data);
      } catch (err) {
        console.log(
          "Fetch schedule error:",
          err
        );
      }
    };

    fetchSchedule();
  }, [id]);

  /* ================= CHECK BPJS ================= */
  const checkBPJS = async () => {
    if (!form.no_bpjs) {
      alert("Masukkan nomor BPJS");
      return;
    }

    try {
      setBpjsLoading(true);

      const res =
        await BookingService.checkBPJS(
          form.no_bpjs
        );

      setBpjsStatus(res.data.status);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Gagal cek BPJS"
      );
    } finally {
      setBpjsLoading(false);
    }
  };

  /* ================= BOOKING ================= */
  const handleBooking = async (
    values: any
  ) => {
    try {
      setLoading(true);

      const payload = {
        scheduleId: Number(id),

        patient: {
          nama_lengkap:
            values.nama_lengkap,

          no_hp: values.no_hp,

          nik: values.nik,

          ttl: values.ttl,

          jenis_kelamin:
            values.jenis_kelamin,

          alamat: values.alamat,
        },

        keluhan: values.keluhan,

        id_insurance: Number(
          values.id_insurance
        ),

        no_bpjs:
          values.no_bpjs || null,
      };

      const res =
        await BookingService.createBooking(
          payload
        );

      router.push(
        `/antrian/${res.data.data.kode_booking}`
      );
    } catch (err) {
      console.log(
        "Booking error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (!schedule) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f7fb]">
        <p className="text-slate-500 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#f4f7fb] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">

        {/* HEADER */}
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
          Booking Konsultasi
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Lengkapi data pasien
        </p>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4 mt-4">

          {/* LEFT */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border p-5">

            <h2 className="font-bold text-slate-800">
              {
                schedule.doctor
                  ?.nama_dokter
              }
            </h2>

            <p className="text-xs text-slate-500">
              {
                schedule.room
                  ?.nama_room
              }
            </p>

            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
              <span>
                🏥 Ruangan:{" "}
                {schedule.room
                  ?.nama_room || "-"}
              </span>

              <span>
                🏢 Lantai:{" "}
                {schedule.room
                  ?.lantai ?? "-"}
              </span>
            </div>

            <p className="mt-3 text-sm">
              {schedule.tanggal
                ? new Date(
                    schedule.tanggal
                  ).toLocaleDateString(
                    "id-ID"
                  )
                : "-"}
            </p>

            <p className="text-sm">
              {formatJam(
                schedule.jam_mulai
              )}{" "}
              -
              {" "}
              {formatJam(
                schedule.jam_selesai
              )}
            </p>

          </div>

          {/* RIGHT */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border p-5">

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-3">

              {/* NAMA */}
              <div>
                <Input
                  placeholder="Nama Lengkap"
                  error={
                    !!errors.nama_lengkap
                  }
                  {...register(
                    "nama_lengkap"
                  )}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors
                      .nama_lengkap
                      ?.message
                  }
                </p>
              </div>

              {/* NO HP */}
              <div>
                <Input
                  placeholder="No HP"
                  error={!!errors.no_hp}
                  {...register(
                    "no_hp"
                  )}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors.no_hp
                      ?.message
                  }
                </p>
              </div>

              {/* NIK */}
              <div>
                <Input
                  placeholder="NIK"
                  error={!!errors.nik}
                  {...register("nik")}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors.nik
                      ?.message
                  }
                </p>
              </div>

              {/* TTL */}
              <div>
                <Input
                  placeholder="TTL"
                  error={!!errors.ttl}
                  {...register("ttl")}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors.ttl
                      ?.message
                  }
                </p>
              </div>

            </div>

            {/* GENDER */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">

              <div>

                <p className="text-xs font-semibold text-slate-500 mb-2">
                  Jenis Kelamin
                </p>

                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "jenis_kelamin",
                        "L"
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold ${
                      watch(
                        "jenis_kelamin"
                      ) === "L"
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    👨 Laki
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "jenis_kelamin",
                        "P"
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold ${
                      watch(
                        "jenis_kelamin"
                      ) === "P"
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    👩 Perempuan
                  </button>

                </div>

              </div>

              {/* PAYMENT */}
              <div>

                <p className="text-xs font-semibold text-slate-500 mb-2">
                  Pembayaran
                </p>

                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "id_insurance",
                        "1"
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold ${
                      watch(
                        "id_insurance"
                      ) === "1"
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    💳 Umum
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "id_insurance",
                        "2"
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold ${
                      watch(
                        "id_insurance"
                      ) === "2"
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    🏥 BPJS
                  </button>

                </div>

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors
                      .id_insurance
                      ?.message
                  }
                </p>

              </div>

            </div>

            {/* BPJS */}
            {watch("id_insurance") ===
              "2" && (
              <div className="mt-4 grid md:grid-cols-[1fr_140px] gap-3">

                <Input
                  placeholder="Nomor BPJS"
                  error={
                    !!errors.no_bpjs
                  }
                  {...register(
                    "no_bpjs"
                  )}
                />

                <button
                  type="button"
                  onClick={checkBPJS}
                  className="rounded-2xl bg-blue-600 text-white text-sm font-semibold"
                >
                  {bpjsLoading
                    ? "Checking..."
                    : "Cek BPJS"}
                </button>

              </div>
            )}

            {/* STATUS */}
            {bpjsStatus && (
              <div
                className={`mt-3 p-3 rounded-2xl text-sm ${
                  bpjsStatus ===
                  "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {bpjsStatus ===
                "ACTIVE"
                  ? "✅ BPJS aktif"
                  : "❌ BPJS tidak aktif"}
              </div>
            )}

            {/* TEXTAREA */}
            <div className="grid md:grid-cols-2 gap-3 mt-4">

              {/* ALAMAT */}
              <div>
                <textarea
                  rows={3}
                  placeholder="Alamat"
                  {...register(
                    "alamat"
                  )}
                  className={`rounded-2xl border p-3 w-full outline-none ${
                    errors.alamat
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors
                      .alamat
                      ?.message
                  }
                </p>
              </div>

              {/* KELUHAN */}
              <div>
                <textarea
                  rows={3}
                  placeholder="Keluhan"
                  {...register(
                    "keluhan"
                  )}
                  className={`rounded-2xl border p-3 w-full outline-none ${
                    errors.keluhan
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <p className="text-xs text-red-500 mt-1">
                  {
                    errors
                      .keluhan
                      ?.message
                  }
                </p>
              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit(
                handleBooking
              )}
              disabled={loading}
              className="mt-5 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold"
            >
              {loading
                ? "Memproses..."
                : "Konfirmasi Booking"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= INPUT ================= */
function Input({
  placeholder,
  error,
  ...props
}: any) {
  return (
    <input
      placeholder={placeholder}
      {...props}
      className={`
        w-full rounded-2xl px-4 py-3 text-sm outline-none transition border
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        }
      `}
    />
  );
}