'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function PromoSlider() {
  return (
    <div className="w-full px-10 mt-6">

      <Swiper spaceBetween={20} slidesPerView={1}>
        
        <SwiperSlide>
          <img src="/promo1.jpg" className="w-full h-[600px] object-cover rounded-xl" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="/promo2.jpeg" className="w-full h-[600px] object-cover rounded-xl" />
        </SwiperSlide>

      </Swiper>

    </div>
  );
}