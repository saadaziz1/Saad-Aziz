import { Header } from "@/components/Header";
import { SubNav } from "@/components/SubNav";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { GameSection } from "@/components/GameSection";
import { GameCard } from "@/components/GameCard";
import { TopSellers } from "@/components/TopSellers";
import { NextUp } from "@/components/NextUp";
import { ExploreCatalog } from "@/components/ExploreCatalog";
import { CatalogBrowse } from "@/components/CatalogBrowse";
import { Footer } from "@/components/Footer";

import imgRectangle10 from "@/assets/1be5fd14f0d86201501c92f4698fc3bec8e7e845.png";
import imgRectangle11 from "@/assets/862f510abd00d067d2f690d1e393b22214be81f1.png";
import imgRectangle12 from "@/assets/57727e74811ee62c7f8ab62f34aa38777d0f96c0.png";
import imgRectangle13 from "@/assets/7e46c618e4893d456011c8175099c5ceeda312ff.png";
import imgRectangle14 from "@/assets/62f707b97e78f207e1a79a64f3a7d6ed0bed1f73.png";

export default function Home() {
  return (
    <div>
      <Header />
      <SubNav />
      <main>
        <HeroSection />
        <FeaturedCarousel />
        
        <GameSection title="Game on sale">
          <GameCard 
            image={imgRectangle10}
            title="Valorant"
            originalPrice="₹900"
            discountPrice="₹850"
            discount="-10%"
          />
          <GameCard 
            image={imgRectangle11}
            title="Assassin's creed Valhalla"
            originalPrice="₹3,499"
            discountPrice="₹2,999"
            discount="-20%"
          />
          <GameCard 
            image={imgRectangle12}
            title="Red Dead Redemption 2"
            originalPrice="₹3,199"
            discountPrice="₹1,599"
            discount="-50%"
          />
          <GameCard 
            image={imgRectangle13}
            title="The Tomb Raider"
            originalPrice="₹2,195"
            discountPrice="₹2,000"
            discount="-20%"
          />
          <GameCard 
            image={imgRectangle14}
            title="Cyberpunk 2077"
            originalPrice="₹4,000"
            discountPrice="₹2,000"
            discount="-50%"
          />
        </GameSection>

        <TopSellers />
        <NextUp />

        <GameSection title="Game with Achievements">
          <GameCard 
            image={imgRectangle10}
            title="Valorant"
            originalPrice="₹900"
            discountPrice="₹850"
            discount="-10%"
          />
          <GameCard 
            image={imgRectangle11}
            title="Assassin's creed Valhalla"
            originalPrice="₹3,499"
            discountPrice="₹2,999"
            discount="-20%"
          />
          <GameCard 
            image={imgRectangle12}
            title="Red Dead Redemption 2"
            originalPrice="₹3,199"
            discountPrice="₹1,599"
            discount="-50%"
          />
          <GameCard 
            image={imgRectangle13}
            title="The Tomb Raider"
            originalPrice="₹2,195"
            discountPrice="₹2,000"
            discount="-20%"
          />
          <GameCard 
            image={imgRectangle14}
            title="Cyberpunk 2077"
            originalPrice="₹4,000"
            discountPrice="₹2,000"
            discount="-50%"
          />
        </GameSection>

        <ExploreCatalog />
        <CatalogBrowse />
        <Footer />
      </main>
    </div>
  );
}