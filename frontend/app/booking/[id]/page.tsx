"use client";

import {
  useEffect,
  useState,
  ChangeEvent,
} from "react";

import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

type FormType = {
  nama_lengkap: string;
  no_hp: string;
  nik: string;
  ttl: string;
  jenis_kelamin: string;
  alamat: string;
  keluhan: string;
  id_insurance: string;
  no_bpjs: string;
};

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [bpjsStatus, setBpjsStatus] =
    useState<string | null>(null);

  const [bpjsLoading, setBpjsLoading] =
    useState(false);

  const [form, setForm] = useState<FormType>({
    nama_lengkap: "",
    no_hp: "",
    nik: "",
    ttl: "",
    jenis_kelamin: "",
    alamat: "",
    keluhan: "",
    id_insurance: "",
    no_bpjs: "",
  });

  useEffect(() => {
    if (id) fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get(
        `/api/schedule/${id}`
      );

      setSchedule(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkBPJS = async () => {
    if (!form.no_bpjs) {
      alert("Masukkan nomor BPJS");
      return;
    }

    try {
      setBpjsLoading(true);

      const res = await api.post(
        "/api/insurance/check-bpjs",
        {
          no_bpjs: form.no_bpjs,
        }
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

  const handleBooking = async () => {
    if (!form.id_insurance) {
      alert("Pilih metode pembayaran");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/api/booking",
        {
          scheduleId: Number(id),

          patient: {
            nama_lengkap:
              form.nama_lengkap,
            no_hp: form.no_hp,
            nik: form.nik,
            ttl: form.ttl,
            jenis_kelamin:
              form.jenis_kelamin,
            alamat: form.alamat,
          },

          keluhan: form.keluhan,
          id_insurance: Number(
            form.id_insurance
          ),
          no_bpjs:
            form.no_bpjs || null,
        }
      );

      const kode =
        res.data.data.kode_booking;

      router.push(`/antrian/${kode}`);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  if (!schedule) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f7fb]">
        <p className="text-slate-500 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] overflow-hidden relative">

      {/* BLUR */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
            Booking Konsultasi
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Lengkapi data pasien
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">

          {/* LEFT */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl shadow-lg">
                👨‍⚕️
              </div>

              <div>
                <h2 className="font-bold text-slate-800 leading-tight">
                  {
                    schedule.doctor
                      ?.nama_dokter
                  }
                </h2>

                <p className="text-xs text-slate-500">
                  Jadwal Pemeriksaan
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <InfoCard
                label="Ruangan"
                value={
                  schedule.room
                    ?.nama_room || "-"
                }
                icon="🏥"
              />

              <InfoCard
                label="Tanggal"
                value={
                  schedule.tanggal
                    ? new Date(
                      schedule.tanggal
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                    : "-"
                }
                icon="🗓"
              />

              <InfoCard
                label="Jam"
                value={`${schedule.jam_mulai?.slice(
                  11,
                  16
                )} - ${schedule.jam_selesai?.slice(
                  11,
                  16
                )}`}
                icon="⏰"
              />

            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-5">

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-3">

              <Input
                placeholder="Nama Lengkap"
                value={
                  form.nama_lengkap
                }
                onChange={(
                  e: ChangeEvent<HTMLInputElement>
                ) =>
                  setForm({
                    ...form,
                    nama_lengkap:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Nomor HP"
                value={form.no_hp}
                onChange={(
                  e: ChangeEvent<HTMLInputElement>
                ) =>
                  setForm({
                    ...form,
                    no_hp:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="NIK"
                value={form.nik}
                onChange={(
                  e: ChangeEvent<HTMLInputElement>
                ) =>
                  setForm({
                    ...form,
                    nik:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="TTL"
                value={form.ttl}
                onChange={(
                  e: ChangeEvent<HTMLInputElement>
                ) =>
                  setForm({
                    ...form,
                    ttl:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* GENDER + INSURANCE */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">

              {/* GENDER */}
              <div>

                <p className="text-xs font-semibold text-slate-500 mb-2">
                  Jenis Kelamin
                </p>

                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (
                          prev
                        ) => ({
                          ...prev,
                          jenis_kelamin:
                            "L",
                        })
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold transition-all
                    ${form.jenis_kelamin ===
                        "L"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white border border-slate-200 hover:bg-blue-50"
                      }`}
                  >
                    👨 Laki
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (
                          prev
                        ) => ({
                          ...prev,
                          jenis_kelamin:
                            "P",
                        })
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold transition-all
                    ${form.jenis_kelamin ===
                        "P"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "bg-white border border-slate-200 hover:bg-pink-50"
                      }`}
                  >
                    👩 Perempuan
                  </button>

                </div>
              </div>

              {/* INSURANCE */}
              <div>

                <p className="text-xs font-semibold text-slate-500 mb-2">
                  Pembayaran
                </p>

                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (
                          prev
                        ) => ({
                          ...prev,
                          id_insurance:
                            "1",
                        })
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold transition-all
                    ${form.id_insurance ===
                        "1"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "bg-white border border-slate-200 hover:bg-green-50"
                      }`}
                  >
                    💳 Umum
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (
                          prev
                        ) => ({
                          ...prev,
                          id_insurance:
                            "2",
                        })
                      )
                    }
                    className={`rounded-2xl py-3 text-sm font-semibold transition-all
                    ${form.id_insurance ===
                        "2"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "bg-white border border-slate-200 hover:bg-orange-50"
                      }`}
                  >
                    🏥 BPJS
                  </button>

                </div>
              </div>

            </div>

            {/* BPJS */}
            {form.id_insurance ===
              "2" && (
                <div className="mt-4 grid md:grid-cols-[1fr_140px] gap-3">

                  <Input
                    placeholder="Nomor BPJS"
                    value={
                      form.no_bpjs
                    }
                    onChange={(
                      e: ChangeEvent<HTMLInputElement>
                    ) =>
                      setForm({
                        ...form,
                        no_bpjs:
                          e.target
                            .value,
                      })
                    }
                  />

                  <button
                    onClick={
                      checkBPJS
                    }
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg"
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
                className={`mt-3 rounded-2xl px-4 py-3 text-sm font-medium
                ${bpjsStatus ===
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

              <textarea
                rows={3}
                placeholder="Alamat"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:ring-4 focus:ring-blue-100"
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement>
                ) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
              />

              <textarea
                rows={3}
                placeholder="Keluhan"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:ring-4 focus:ring-blue-100"
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement>
                ) =>
                  setForm({
                    ...form,
                    keluhan:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={
                handleBooking
              }
              disabled={loading}
              className="mt-5 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:scale-[1.01] transition-all"
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

/* INPUT */
function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
    />
  );
}

/* INFO CARD */
function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">

      <p className="text-[11px] text-slate-400 mb-1">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span>{icon}</span>
        <span>{value}</span>
      </div>

    </div>
  );
}