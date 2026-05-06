"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { kode } = useParams();
  const [bpjsStatus, setBpjsStatus] = useState<string | null>(null);
  const [bpjsLoading, setBpjsLoading] = useState(false);

  //  SINGLE SOURCE OF TRUTH
  const [form, setForm] = useState({
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

  //  FETCH 
  useEffect(() => {
    if (id) fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get(`/api/schedule/${id}`);
      setSchedule(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  //  BPJS 
  const checkBPJS = async () => {
    if (!form.no_bpjs) {
      alert("Masukkan nomor BPJS dulu");
      return;
    }

    try {
      setBpjsLoading(true);

      const res = await api.post("/api/insurance/check-bpjs", {
        no_bpjs: form.no_bpjs,
      });

      const status = res.data.status;
      setBpjsStatus(status);

      if (status === "ACTIVE") {
        alert("BPJS aktif");
      } else {
        alert("BPJS tidak aktif, gunakan umum");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal cek BPJS");
    } finally {
      setBpjsLoading(false);
    }
  };

  //  BOOKING 
  const handleBooking = async () => {
    if (!schedule) return;

    // VALIDASI
    if (!form.id_insurance) {
      alert("Pilih asuransi dulu");
      return;
    }

    if (form.id_insurance === "2" && !form.no_bpjs) {
      alert("Masukkan nomor BPJS");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/booking", {
        scheduleId: Number(id),
        patient: {
          nama_lengkap: form.nama_lengkap,
          no_hp: form.no_hp,
          nik: form.nik,
          ttl: form.ttl,
          jenis_kelamin: form.jenis_kelamin,
          alamat: form.alamat,

        },
        keluhan: form.keluhan,
        id_insurance: Number(form.id_insurance),
        no_bpjs: form.no_bpjs || null,
      });

      const kode = res.data.data.kode_booking;
      router.push(`/antrian/${kode}`);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // LOADING 
  if (!schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">Detail Jadwal</h2>

          <p>👨‍⚕️ {schedule.doctor?.nama_dokter}</p>
          <p>🏥 {schedule.room?.nama_room || "-"}</p>

          <p>
            🗓{" "}
            {schedule.tanggal
              ? new Date(schedule.tanggal).toLocaleDateString()
              : "-"}
          </p>

          <p>
            ⏰ {schedule.jam_mulai?.slice(11, 16)} -{" "}
            {schedule.jam_selesai?.slice(11, 16)}
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">Data Pasien</h2>

          <div className="space-y-3">

            <input
              placeholder="Nama"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, nama_lengkap: e.target.value })
              }
            />

            <input
              placeholder="No HP"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, no_hp: e.target.value })
              }
            />

            <input
              placeholder="NIK"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, nik: e.target.value })
              }
            />

            <input
              placeholder="tempat tanggal lahir"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, ttl: e.target.value })
              }
            />

<select
  value={form.jenis_kelamin}
  className="w-full border p-2 rounded"
  onChange={(e) =>
    setForm({ ...form, jenis_kelamin: e.target.value })
  }
>
  <option value="">Pilih Jenis Kelamin</option>
  <option value="L">Laki-laki</option>
  <option value="P">Perempuan</option>
</select>

            <textarea
              placeholder="Alamat"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, alamat: e.target.value })
              }
            />

            <textarea
              placeholder="Keluhan"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, keluhan: e.target.value })
              }
            />

            {/* INSURANCE */}
            <select
              value={form.id_insurance}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, id_insurance: e.target.value })
              }
            >
              <option value="">Pilih Asuransi</option>
              <option value="1">UMUM</option>
              <option value="2">BPJS</option>
            </select>

            {/* BPJS */}
            {form.id_insurance === "2" && (
              <div className="space-y-2">
                <input
                  value={form.no_bpjs}
                  placeholder="Nomor BPJS"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setForm({ ...form, no_bpjs: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={checkBPJS}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {bpjsLoading ? "Mengecek..." : "Cek BPJS"}
                </button>

                {bpjsStatus === "ACTIVE" && (
                  <p className="text-green-600">BPJS aktif</p>
                )}

                {bpjsStatus === "INACTIVE" && (
                  <p className="text-red-600">
                    BPJS tidak aktif → gunakan umum
                  </p>
                )}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              disabled={loading}
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? "Memproses..." : "Konfirmasi Booking"}
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}