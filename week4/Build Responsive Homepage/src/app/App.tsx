import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { CategoriesSection } from "./components/categories-section";
import { DevicesSection } from "./components/devices-section";
import { FaqSection } from "./components/faq-section";
import { PricingSection } from "./components/pricing-section";
import { TrialCtaSection } from "./components/trial-cta-section";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#141414] scroll-smooth">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <CategoriesSection />
        <DevicesSection />
        <FaqSection />
        <PricingSection />
        <TrialCtaSection />
      </main>
      <Footer />
    </div>
  );
}