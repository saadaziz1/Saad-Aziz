"use client";

import { 
  Header, 
  Footer, 
  SubNav, 
  HeroSection, 
  FeaturedCarousel, 
  GameSection, 
  GameCard, 
  ExploreCatalog, 
  FreeGames, 
  TopSellers 
} from "@/components";
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { gameData } = useGameStore();
  
  return (
    <div >
      <Header />
      
      <main className="max-w-[1440px] mx-auto">
        <SubNav />
        <HeroSection />
        <GameSection title="Game on sale">
          {gameData.gameOnSale.map((game) => (
            <GameCard 
              key={game.id}
              image={game.image}
              title={game.title}
              originalPrice={game.originalPrice}
              discountPrice={game.discountPrice}
              discount={game.discount}
            />
          ))}
        </GameSection>
        <FeaturedCarousel />
        
        <FreeGames />

       
         <TopSellers />

        <FeaturedCarousel />
         
        <GameSection title="Game with Achievements">
          {gameData.gameOnSale.map((game) => (
            <GameCard 
              key={game.id}
              image={game.image}
              title={game.title}
              originalPrice={game.originalPrice}
              discountPrice={game.discountPrice}
              discount={game.discount}
            />
          ))}
        </GameSection>

        <ExploreCatalog />
        
        <Footer />
      </main>
    </div>
  );
}