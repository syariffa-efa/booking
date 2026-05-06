"use client";

import MenuCard from "./MenuCard";
import { Calendar, History, ClipboardList } from "lucide-react";

export default function MenuGrid() {
  const menu = [
    {
      title: "Jadwal Dokter",
      icon: Calendar,
      path: "/jadwal",
    },
    {
      title: "Riwayat Booking",
      icon: History,
      path: "/riwayat",
    },
    {
      title: "Booking",
      icon: ClipboardList,
      path: "/jadwal",
    },
  ];

  return (
    <div className="flex justify-center gap-10 mt-10">
      {menu.map((item, i) => (
        <MenuCard key={i} item={item} />
      ))}
    </div>
  );
}