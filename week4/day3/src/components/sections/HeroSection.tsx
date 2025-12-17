"use client";

import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { HeroSideCard } from '../cards/HeroSideCard';
import { useGameStore } from '@/store/gameStore';

import 'swiper/css';

export function HeroSection() {
  const { activeHeroGame, activeHeroIndex, setActiveHero, gameData } = useGameStore();
  const { sideGames } = gameData.heroSection;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeHeroIndex + 1) % sideGames.length;
      setActiveHero(sideGames[nextIndex], nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeHeroIndex, sideGames, setActiveHero]);

  return (
    <div className="px-4 md:px-16 lg:px-24 py-6 w-full text-[#F5F5F5] ">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main Featured Game */}
        <div className="bg-white rounded-[20px] overflow-hidden relative h-[400px] md:h-[432px] md:w-[797px]">
          <img 
            src={activeHeroGame.image} 
            alt={activeHeroGame.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <div className="flex flex-col gap-6 md:gap-10 text-white">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase">{activeHeroGame.subtitle}</p>
                <p className="text-sm md:text-base max-w-[300px]">
                  {activeHeroGame.description}
                </p>
              </div>
              <button className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors text-sm md:text-base w-fit">
                {activeHeroGame.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Side Cards - Vertical Slider */}
        <div className="h-[432px] w-full md:w-auto">
          <Swiper
            modules={[Autoplay]}
            direction="vertical"
            spaceBetween={12}
            slidesPerView={4}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false
            }}
            className="h-full"
          >
            {sideGames.map((game, index) => (
              <SwiperSlide key={game.id}>
                <HeroSideCard 
                  image={game.image}
                  title={game.title}
                  isActive={activeHeroIndex === index}
                  onClick={() => {
                    setActiveHero(game, index);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}