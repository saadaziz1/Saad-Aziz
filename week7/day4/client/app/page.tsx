import { Box } from "@mui/material";
import { TopBrandingBar } from "@/components/layout/TopBrandingBar";
import { Navbar } from "@/components/layout/Navbar";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { Hero } from "@/components/home/Hero/Hero";
import { Promotion } from "@/components/home/Promotion/Promotion";
import { ProductSection } from "@/components/home/ProductSection/ProductSection";
import { CategorySection } from "@/components/home/CategorySection/CategorySection";
import { MarketingBanner } from "@/components/home/MarketingBanner/MarketingBanner";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <TopBrandingBar />

      <MarqueeBanner />
      <main className="overflow-hidden max-w-[1440px] mx-auto">
        <Hero />
        <Promotion />
        <ProductSection />
        <CategorySection />
        <MarketingBanner />
      </main>
      <Footer />
    </Box>
  );
}
