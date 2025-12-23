"use client";

import { useState } from "react";
import { PlanCard } from "../../ui/plan-card";

interface Plan {
  id: string;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular?: boolean;
}

interface SubscriptionSectionProps {
  title?: string;
  subtitle?: string;
  plans: Plan[];
  onStartTrial?: (planId: string) => void;
  onChoosePlan?: (planId: string, period: "month" | "year") => void;
}

export function SubscriptionSection({
  title = "Choose the plan that's right for you",
  subtitle = "Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!",
  plans,
  onStartTrial,
  onChoosePlan
}: SubscriptionSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-10 px-5 lg:py-20 lg:px-15">
      <div className="max-w-360 3xl:max-w-400 mx-auto">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center mb-16">
          <div className="flex-1">
            <h2 className="text-white text-4xl 3xl:text-5xl font-bold mb-4">{title}</h2>
            <p className="text-gray-400 text-base 3xl:text-lg max-w-5xl">{subtitle}</p>
          </div>
          
          <div className="flex bg-[#0F0F0F] border border-[#333] rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-[#262626] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-[#262626] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.title}
              description={plan.description}
              price={billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
              period={billingPeriod === "monthly" ? "month" : "year"}
              isPopular={plan.isPopular}
              onStartTrial={() => onStartTrial?.(plan.id)}
              onChoosePlan={() => onChoosePlan?.(plan.id, billingPeriod === "monthly" ? "month" : "year")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}