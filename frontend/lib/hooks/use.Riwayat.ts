"use client";

import { useEffect, useState } from "react";
import { RiwayatService } from "@/lib/service/riwayat.service";

export const useRiwayat = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);

      const res = await RiwayatService.getAll();

      setData(res.data.data || []);
    } catch (err) {
      console.log("Error riwayat:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await RiwayatService.cancel(id);

      fetchRiwayat(); // refresh
    } catch (err) {
      console.log("Cancel error:", err);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return {
    data,
    loading,
    fetchRiwayat,
    cancelBooking,
  };
};