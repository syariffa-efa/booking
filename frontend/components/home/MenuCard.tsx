"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function MenuCard({ item }: any) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const Icon = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.08)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(item.path)}
      className="cursor-pointer text-center bg-white p-6 rounded-2xl shadow-md transition-all duration-200 hover:shadow-xl group"
    >
      <Icon
        size={48}
        className="mx-auto text-blue-500 group-hover:scale-110 transition"
      />

      <p className="mt-4 font-semibold text-gray-700">
        {item.title}
      </p>
    </div>
  );
}