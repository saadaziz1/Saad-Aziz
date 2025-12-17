import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface GameSectionProps {
  title: string;
  children: ReactNode;
}

export function GameSection({ title, children }: GameSectionProps) {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg md:text-xl">{title}</h2>
        <div className="flex items-center gap-2">
          <button className="w-[30px] h-[30px] rounded-full border border-[rgba(245,245,245,0.5)] flex items-center justify-center hover:border-white transition-colors">
            <ChevronLeft className="w-5 h-5 text-[rgba(245,245,245,0.5)] hover:text-white" />
          </button>
          <button className="w-[30px] h-[30px] rounded-full border border-[#f5f5f5] flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-[#f5f5f5]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {children}
      </div>
    </div>
  );
}
