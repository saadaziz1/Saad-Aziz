"use client";
import { MessageCircle, Zap, TrendingUp, Target } from "lucide-react";

interface QuickQuestionsProps {
  onSelect: (q: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const quickQuestions = [
    {
      text: "Show top 10 ODI Teams by average",
      icon: Target,
    },
    {
      text: "Latest Test match results",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mb-8 p-4 bg-black/20 border-y border-cyan-900/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-cyan-900"></div>
        <div className="inline-flex items-center gap-3 pixel-box !bg-panel border-cyan-400 py-1 px-4">
          <MessageCircle className="w-3 h-3 text-magenta-500" />
          <p className="text-[10px] pixel-font text-cyan-400">
            QUICK ACCESS COMMANDS
          </p>
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-cyan-900"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickQuestions.map((q, index) => {
          const IconComponent = q.icon;
          const isOdd = index % 2 !== 0;
          return (
            <button
              key={index}
              onClick={() => onSelect(q.text)}
              className={`pixel-btn !p-6 text-left group flex items-center gap-6 ${isOdd ? 'pixel-btn-magenta' : ''}`}
            >
              <div className={`p-3 border-2 ${isOdd ? 'border-pink-900 group-hover:bg-pink-500' : 'border-cyan-900 group-hover:bg-cyan-500'} transition-all shadow-inner`}>
                <IconComponent className={`w-5 h-5 ${isOdd ? 'text-pink-500 group-hover:text-white' : 'text-cyan-500 group-hover:text-black'}`} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[10px] space-y-1 block">
                  <span className="opacity-50 text-[8px] block mb-1">COMMAND PATH {index}</span>
                  <span className="uppercase group-hover:text-white transition-colors">
                    {q.text}
                  </span>
                </p>
              </div>
              <Zap className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isOdd ? 'text-pink-500' : 'text-cyan-500'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
