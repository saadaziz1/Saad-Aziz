import { HeroSection } from "@/src/components/organisms/HeroSection";
import { MintingSection } from "@/src/components/organisms/MintingSection";
import { NFTGallery } from "@/src/components/organisms/NFTGallery";
import { AdminPanel } from "@/src/components/organisms/AdminPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="relative">
        {/* Section Separator Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        <MintingSection />
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        <NFTGallery />
      </div>

      <AdminPanel />

      <footer className="py-12 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            © 2026 Demon Slayer Corps. All rights reserved.
          </p>
          <div className="flex gap-8 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Contract</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
