"use client";

import { FeaturedGameCard } from '../cards/FeaturedGameCard';
import { useGameStore } from '@/store/gameStore';

export function FeaturedCarousel() {
  const { gameData } = useGameStore();
  
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8 mt-[40px]">
      <div className="flex  gap-4 overflow-x-auto scrollbar-hide">
        {gameData.featuredGames.map((game) => (
          <FeaturedGameCard key={game.id} image={{ src: game.image }} title={game.title} description={game.description} price={game.price} />
        ))}
      </div>
    </div>
  );
}
