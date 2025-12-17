import { create } from 'zustand';
import gameData from '@/data/gameData.json';

interface GameStore {
  // Hero section state
  activeHeroGame: any;
  activeHeroIndex: number;
  setActiveHero: (game: any, index: number) => void;
  
  // Game data
  gameData: typeof gameData;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initialize with first side game
  activeHeroGame: gameData.heroSection.sideGames[0],
  activeHeroIndex: 0,
  
  setActiveHero: (game, index) => set({ 
    activeHeroGame: game, 
    activeHeroIndex: index 
  }),
  
  gameData: gameData,
}));