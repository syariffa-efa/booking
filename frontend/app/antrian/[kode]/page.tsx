"use client";

import {useEffect,useState,} from "react";
import {useParams,useRouter,} from "next/navigation";
import QRCode from "react-qr-code";
import { AntrianService } from "@/lib/service/antrian.service";
import { ANTRIAN_STEPS } from "@/lib/constants/antrianFlow";

export default function AntrianPage() {
  const router = useRouter();

  const { kode } = useParams<{
    kode: string | string[];
  }>();

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (
      !kode ||
      Array.isArray(kode)
    )
      return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res =
          await AntrianService.getByKode(
            kode
          );

        setData(res.data.data);
      } catch (err) {
        console.log(
          "FETCH ERROR:",
          err
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kode]);

  if (loading) {
    return (
      <p className="text-center mt-20">
        Loading...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center mt-20">
        Data tidak ditemukan
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white rounded-3xl shadow-xl w-[420px] p-6">

        {/* NOMOR */}
        <div className="bg-gradient-to-r from-[#dbeafe] via-[#bfdbfe] to-[#cbd5f5] text-blue-800 rounded-2xl p-6 text-center mb-6 shadow-md">

          <p className="text-sm opacity-70">
            No Antrian Poliklinik
          </p>

          <h1 className="text-5xl font-extrabold tracking-wider">
            {data.no_antrian ?? "-"}
          </h1>

        </div>

        {/* INFO */}
        <div className="text-sm space-y-2 mb-4">

          <p>
            <b>Nama:</b>{" "}
            {data.patient
              ?.nama_lengkap ?? "-"}
          </p>

          <p>
            <b>Dokter:</b>{" "}
            {data.schedule?.doctor
              ?.nama_dokter ?? "-"}
          </p>

          <p>
            <b>Tanggal:</b>{" "}
            {data.schedule?.tanggal
              ? new Date(
                  data.schedule.tanggal
                ).toLocaleDateString(
                  "id-ID"
                )
              : "-"}
          </p>

          <p>
            <b>Status:</b>{" "}
            {data.status ?? "-"}
          </p>

          <p>
            <b>Kode Booking:</b>{" "}
            {data.kode_booking ?? "-"}
          </p>

        </div>

        {/* QR */}
        <div className="flex justify-center my-4">
          <QRCode
            value={
              data.kode_booking ?? "-"
            }
            size={120}
          />
        </div>

        {/* ESTIMASI */}
        <div className="flex justify-between items-center border-t pt-4 mb-4">

          <div>

            <p className="text-sm text-gray-500">
              Estimasi Dilayani
            </p>

            <p className="font-semibold">
              {data.schedule?.tanggal
                ? new Date(
                    data.schedule.tanggal
                  ).toLocaleDateString(
                    "id-ID"
                  )
                : "-"}{" "}
              {data.schedule?.jam_mulai?.slice(
                11,
                16
              ) ?? "-"}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Peserta dilayani
            </p>

            <p className="text-2xl font-bold">
              {data.peserta_dilayani ??
                "-"}
            </p>

          </div>

        </div>

        {/* FLOW */}
        <p className="font-semibold text-lg mb-3">
          Status Antrian :
        </p>

        <div className="space-y-4">

          {ANTRIAN_STEPS.map(
            (step, index) => {
              const active =
                data.flow?.[step.key];

              return (
                <div
                  key={step.key}
                  className="flex items-start gap-3"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded ${
                        active
                          ? "bg-black text-white"
                          : "border border-black"
                      }`}
                    >
                      {active && "✔"}
                    </div>

                    {index !==
                      ANTRIAN_STEPS.length -
                        1 && (
                      <div className="w-[2px] h-10 bg-gray-400" />
                    )}

                  </div>

                  <div>

                    <p
                      className={`font-semibold ${
                        active
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>

                    <p className="text-sm text-gray-500">
                      {step.desc}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* BUTTON */}
        <button
          onClick={() =>
            router.push("/riwayat")
          }
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Lihat Riwayat Booking
        </button>

      </div>

    </div>
  );
}