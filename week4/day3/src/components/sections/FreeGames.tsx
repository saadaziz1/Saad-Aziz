"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FreeGameCard } from '../cards/FreeGameCard';
import { Button } from '../common/Button';
import { useGameStore } from '@/store/gameStore';

import 'swiper/css';

export function FreeGames() {
  const { gameData } = useGameStore();
  
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mb-[80px]">
      <div className="absolute left-[calc(7.5%+1px)] right-[calc(7.5%+1px)] bg-[#2a2a2a] rounded-[4px] p-[40px]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-[46px] h-[46px]">
              <svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3L26.09 16.26L38 13L30.18 23L38 33L26.09 29.74L23 43L19.91 29.74L8 33L15.82 23L8 13L19.91 16.26L23 3Z" fill="white"/>
              </svg>
            </div>
            <h2 className="text-white text-[18px] font-['Poppins']">Free Games</h2>
          </div>
          <Button variant="outline" size="md" className="font-['Poppins']">
            view More
          </Button>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={22}
          slidesPerView={4}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            
          }}
        >
          {gameData.freeGames.map((game) => (
            <SwiperSlide key={game.id}>
              <FreeGameCard 
                image={{ src: game.image }} 
                title={game.title} 
                availability={game.availability} 
                status={game.status} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="h-[522px]" />
    </div>
  );
}