import { Navbar } from "@/components/organisms/Navbar";
import { TokenDashboard } from "@/components/organisms/TokenDashboard";
import { Footer } from "@/components/organisms/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <Navbar />
      <div className="pt-20 pb-12">
        <TokenDashboard />
      </div>
      <Footer />
    </main>
  );
}
