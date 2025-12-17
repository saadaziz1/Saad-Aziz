import { TopHeader } from "./components/TopHeader";
import { SubHeader } from "./components/SubHeader";
import { HeroSection } from "./components/HeroSection";
import { FeaturedGames } from "./components/FeaturedGames";
import { GameOnSale } from "./components/GameOnSale";
import { FreeGames } from "./components/FreeGames";
import { TopSellers } from "./components/TopSellers";
import { GameWithAchievements } from "./components/GameWithAchievements";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#121212] relative">
      <TopHeader />
      <SubHeader />
      <HeroSection />
      <FeaturedGames />
      <GameOnSale />
      <FreeGames />
      <TopSellers />
      <GameWithAchievements />
      <Footer />
    </div>
  );
}
