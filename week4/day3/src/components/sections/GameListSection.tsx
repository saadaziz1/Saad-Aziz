"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { SectionHeader } from '../common/SectionHeader';
import { ListGameCard } from '../cards/ListGameCard';

import 'swiper/css';

interface Game {
  id: number;
  image: { src: string };
  title: string;
  price: string;
}

interface GameListSectionProps {
  title: string;
  games: Game[];
}

export function GameListSection({ title, games }: GameListSectionProps) {
  return (
    <div>
      <SectionHeader title={title} showViewMore />
      <div className="block lg:hidden">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 }
          }}
        >
          {games.map((game) => (
            <SwiperSlide key={game.id}>
              <ListGameCard {...game} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hidden lg:flex lg:flex-col gap-4 w-full lg:w-[345px]">
        {games.map((game) => (
          <ListGameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
}