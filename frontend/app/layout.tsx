"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // route yang TIDAK pakai header/footer
  const hideLayout =
    pathname === "/login" || pathname === "/register";

  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Providers>
          {!hideLayout && <Header />}

          <main className="flex-1">{children}</main>

          {!hideLayout && <Footer />}
        </Providers>
      </body>
    </html>
  );
}