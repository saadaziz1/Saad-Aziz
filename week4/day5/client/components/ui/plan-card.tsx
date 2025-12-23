"use client";

interface PlanCardProps {
  title: string;
  description: string;
  price: number;
  period: "month" | "year";
  isPopular?: boolean;
  onStartTrial: () => void;
  onChoosePlan: () => void;
}

export function PlanCard({ 
  title, 
  description, 
  price, 
  period,
  isPopular = false,
  onStartTrial, 
  onChoosePlan 
}: PlanCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-8 relative ">
      <h3 className="text-white text-xl 3xl:text-3xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 text-sm 3xl:text-lg mb-8 leading-relaxed min-h-[60px]">{description}</p>
      
      <div className="mb-8">
        <span className="text-white text-4xl 3xl:text-6xl font-bold">${price}</span>
        <span className="text-gray-400 text-base">/{period}</span>
      </div>
      
      <div className="flex gap-3 text-sm lg:text-base 3xl:text-xl">
        <button
          onClick={onStartTrial}
          className="w-full bg-[#141414] hover:bg-[#333] text-white py-3 3xl:py-5 rounded-lg font-medium transition-colors border border-[#262626]"
        >
          Start Free Trial
        </button>
        <button
          onClick={onChoosePlan}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 3xl:py-5 rounded-lg font-medium transition-colors"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
}