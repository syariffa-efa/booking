"use client";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PromoSlider from '@/components/home/promo';
import MenuGrid from '@/components/home/menu';
import MapSection from '@/components/home/maps';
import DoctorFeatured from "@/components/Doctors/DoctorFeatured";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* PROMO SLIDER */}
      <PromoSlider />

       {/* TOP 5 */}
       <DoctorFeatured />

      {/* MENU */}
      <MenuGrid />

      {/* MAPS */}
      <MapSection />

    </div>
  );
}