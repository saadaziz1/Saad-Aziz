"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

import 'swiper/css';
import 'swiper/css/navigation';

interface GameSectionProps {
  title: string;
  children: ReactNode[];
}

export function GameSection({ title, children }: GameSectionProps) {
  return (
    <div className="px-4 md:px-16 lg:px-24 pb-9 pt-5 ">
      <div className="flex items-center justify-between mb-7 font-normal">
        <div className='flex gap-1 items-center '>
          <h2 className="text-white text-lg md:text-xl">{title}</h2>
         <button>
          <ChevronRight className="w-3 h-3 hover:text-[rgba(245,245,245,0.5)] text-white " />
         </button>

        </div>
        
        <div className="flex items-center gap-2">
          <button className="swiper-button-prev-custom w-[30px] h-[30px] rounded-full border border-[rgba(245,245,245,0.5)] flex items-center justify-center active:border-white hover:border-white transition-colors">
            <ChevronLeft className="w-5 h-5 text-[rgba(245,245,245,0.5)] hover:text-white active:text-white" />
          </button>
          <button className="swiper-button-next-custom w-[30px] h-[30px] rounded-full border border-[rgba(245,245,245,0.5)] hover:border-[#f5f5f5] active:border-white flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-[rgba(245,245,245,0.5)] hover:text-white active:text-white" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false
        }}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom'
        }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 }
        }}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}