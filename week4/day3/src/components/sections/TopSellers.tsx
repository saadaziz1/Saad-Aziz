"use client";

import { GameListSection } from './GameListSection';
import { useGameStore } from '@/store/gameStore';

export function TopSellers() {
  const { gameData } = useGameStore();
  
  return (
    <div className=" w-full max-w-[1440px]  px-14 lg:px-24">
      <div className="">
        <div className="flex flex-col lg:flex-row gap-[40px] ">
          <div className=''>
          <GameListSection title="Top Sellers" games={gameData.topSellers.map(game => ({ ...game, image: { src: game.image } }))} />

          </div>
          <div className='border-t lg:border-t-0  lg:border-l border-white/10 pl-4'>
          <GameListSection title="Best Seller" games={gameData.bestSellers.map(game => ({ ...game, image: { src: game.image } }))} />

          </div>
          <div className='border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 pl-4'>
          <GameListSection title="Next Up" games={gameData.topSellers.map(game => ({ ...game, image: { src: game.image } }))} />

          </div>
          
          
        </div>
      </div>
      
    </div>
  );
}
