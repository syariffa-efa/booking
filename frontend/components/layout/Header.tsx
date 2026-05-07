"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menu = [
    { name: "Beranda", path: "/dashboard" },
    { name: "Tentang Kami", path: "/About" },
    { name: "FAQ", path: "/FAQ" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">

        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image src="/nuha.png" alt="logo" width={45} height={45} />
          <h1 className="font-bold text-xl text-blue-700 tracking-wide">
            NUHA
          </h1>
        </div>

        <nav className="flex gap-6">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="text-gray-600 hover:text-blue-600"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              U
            </div>
            <span className="text-sm text-blue-700">Pengguna</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => alert("Setting")}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
              >
                ⚙️ Setting
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}