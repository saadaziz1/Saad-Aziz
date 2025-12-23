"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ArrowLeft, ArrowRight, Play, Plus, Volume2, VolumeX } from "lucide-react";
import 'swiper/css';
import 'swiper/css/navigation';
import { Button } from "./button";

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  year?: string;
  rating?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  onPlay?: (slideId: string) => void;
  onWatchlist?: (slideId: string) => void;
}

export function HeroCarousel({ slides, onPlay, onWatchlist }: HeroCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handlePrevious = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div className="relative h-[468px] lg:h-[709px] 3xl:h-[835px] mb-12 rounded-xl overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex % slides.length);
        }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.backgroundImage}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 lg:bottom-20  left-1/2 -translate-x-1/2 w-full px-8 text-center max-w-4xl">
                <h1 className="text-white text-3xl lg:text-5xl 3xl:text-7xl font-bold mb-4">{slide.title}</h1>
                <p className="text-gray-300 hidden lg:block text-lg 3xl:text-2xl mb-8 leading-relaxed line-clamp-3">
                  {slide.description}
                </p>
                
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-8">
                  <button
                    onClick={() => onPlay?.(slide.id)}
                    className="bg-red-600 hover:bg-red-700 w-full lg:w-fit text-center justify-center text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-3"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Now
                  </button>
                  <div className="flex gap-5">
                  <button
                    onClick={() => onWatchlist?.(slide.id)}
                    className="bg-[#262626]/80 hover:bg-[#333]/80 text-white p-4 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-[#262626]/80 hover:bg-[#333]/80 text-white p-4 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="hidden lg:block absolute bottom-0 z-10 w-full">
         <div className="flex items-center gap-4 p-4 w-full justify-between">
      <Button
        variant="outline"
        
        className="bg-[#0F0F0F] w-11 h-11 3xl:w-14 3xl:h-14 border-[#262626] text-white hover:bg-[#E50000]/90"
        onClick={handlePrevious}
      >
        <ArrowLeft className="w-6 h-6 3xl:w-8 3xl:h-8" />
      </Button>
      
      <div className="flex items-center gap-1">
        {[0,0,0,0].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-4 3xl:w-6 3xl:h-2 rounded-full transition-colors duration-300 ${
              index === (currentSlide % 4) ? "bg-red-600" : "bg-[#262626]"
            }`}
          />
        ))}
      </div>
      
      <Button
        variant="outline"
       
        className="bg-[#0F0F0F] w-11 h-11 3xl:w-14 3xl:h-14 border-[#262626] text-white hover:bg-[#E50000]/90"
        onClick={handleNext}
      >
        <ArrowRight className="w-6 h-6 3xl:w-8 3xl:h-8" />
      </Button>
    </div>
      </div>
    </div>
  );
}