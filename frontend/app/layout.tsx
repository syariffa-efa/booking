import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Providers>

          <Header />

          {/* CONTENT */}
          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </Providers>
      </body>
    </html>
  );
}