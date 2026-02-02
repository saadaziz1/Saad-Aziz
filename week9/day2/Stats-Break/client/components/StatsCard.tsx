"use client";
import { Activity, Trophy, Users, TrendingUp, Sparkles } from "lucide-react";

export default function StatsCards() {
  const cards = [
    {
      icon: Activity,
      title: "LIVE THREAD",
      value: "UPLINK OK",
      color: "cyan",
      description: "DATA STREAMS"
    },
    {
      icon: Trophy,
      title: "ARCHIVE X",
      value: "99.9% SYNC",
      color: "magenta",
      description: "LEGACY DATA"
    },
    {
      icon: Users,
      title: "NODE POOL",
      value: "ACTIVE",
      color: "cyan",
      description: "NEURAL AGENTS"
    },
    {
      icon: TrendingUp,
      title: "HEURISTICS",
      value: "ANALYZING",
      color: "magenta",
      description: "NEURAL SIGHT"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => {
        const IconComponent = card.icon;
        const isMagenta = card.color === "magenta";
        return (
          <div
            key={i}
            className="flex flex-col"
          >
            <div className={`panel-header self-start ml-2 ${isMagenta ? '!bg-pink-600' : ''}`}>
              MODULE 0{i + 1}
            </div>
            <div className={`pixel-box h-full ${isMagenta ? 'pixel-box-magenta' : 'border-cyan-400'} group cursor-pointer`}>
              <div className="relative text-center space-y-4">
                <div className={`inline-flex p-3 ${isMagenta ? 'bg-pink-500' : 'bg-cyan-500'} text-black shadow-[0_0_10px_rgba(45,226,230,0.3)] group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <p className={`text-[8px] pixel-font ${isMagenta ? 'text-pink-400' : 'text-cyan-400'} opacity-70`}>
                    {card.title}
                  </p>
                  <p className="text-xs pixel-font text-white glow-text-cyan">
                    {card.value}
                  </p>
                  <p className="text-[8px] pixel-font text-purple-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
