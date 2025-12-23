"use client";

import { categoriesData } from '@/components/constants/index';
import { CategoriesSection } from '@/components/sections/Homepage/CategoriesSection';
import { DevicesSection } from '@/components/sections/Homepage/DevicesSection';
import { FAQSection } from '@/components/sections/Homepage/FAQSection';
import { FreeTrialSection } from '@/components/sections/Homepage/FreeTrialSection';
import { SubscriptionSection } from '@/components/sections/Homepage/SubscriptionSection';
import HeroSection from '@/components/sections/Homepage/HeroSection';
import { streamVibeFAQs } from '@/components/constants/faq-data';
import { subscriptionPlans } from '@/components/constants/subscription-data';
import { useMovies } from '@/hooks/useMovies';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlanModal } from '@/components/ui/plan-modal';

const page = () => {
  const { movies } = useMovies();
  const { isAuthenticated } = useAuthStore();
  const { subscription } = useSubscription();
  const router = useRouter();
  const [planModal, setPlanModal] = useState<{
    isOpen: boolean;
    planId?: string;
    planName?: string;
    period?: 'month' | 'year';
    price?: number;
    isFreeTrial?: boolean;
  }>({ isOpen: false });

  const handleAskQuestion = () => {
    console.log('Ask question clicked');
  };

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (subscription?.status === 'active' || subscription?.status === 'trial') {
      alert('You already have an active subscription');
      return;
    }
    
    setPlanModal({ isOpen: true, isFreeTrial: true });
  };

  const handleChoosePlan = (planId: string, period: "month" | "year") => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      setPlanModal({
        isOpen: true,
        planId,
        planName: plan.title,
        period,
        price: period === 'month' ? plan.monthlyPrice : plan.yearlyPrice,
        isFreeTrial: false
      });
    }
  };

  const handleFreeTrialClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (subscription?.status === 'active' || subscription?.status === 'trial') {
      alert('You already have an active subscription');
      return;
    }
    
    setPlanModal({ isOpen: true, isFreeTrial: true });
  };

  const handleStartWatching = () => {
    if (isAuthenticated) {
      if (movies.length > 0) {
        router.push(`/movies/${movies[0]._id}`);
      }
    } else {
      router.push('/auth/login');
    }
  };

  // Create movie categories from backend data - show all genres without filtering
  const movieCategories = movies.length > 0 ? [
    {
      title: "Action",
      movies: movies.slice(0, 4) // Show first 4 movies as preview
    },
    {
      title: "Drama", 
      movies: movies.slice(4, 8) // Show next 4 movies as preview
    },
    {
      title: "Comedy",
      movies: movies.slice(8, 12) // Show next 4 movies as preview
    },
    {
      title: "Horror",
      movies: movies.slice(12, 16) // Show next 4 movies as preview
    },
    {
      title: "Romance",
      movies: movies.slice(16, 20) // Show next 4 movies as preview
    },
    {
      title: "Sci-Fi",
      movies: movies.slice(0, 4) // Cycle back for more categories
    }
  ] : [];

  return (
    <div>
      <HeroSection onStartWatching={handleStartWatching} />
      {movieCategories.length > 0 ? (
        <CategoriesSection 
          categoriesData={movieCategories} 
          title='Explore our wide variety of categories' 
          description="Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new" 
        />
      ) : (
        <CategoriesSection 
          categoriesData={categoriesData} 
          title='Explore our wide variety of categories' 
          description="Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new" 
        />
      )}
      <DevicesSection />
      <SubscriptionSection 
        plans={subscriptionPlans}
        onStartTrial={handleStartTrial}
        onChoosePlan={handleChoosePlan}
      />
      <FAQSection 
        faqs={streamVibeFAQs}
        onButtonClick={handleAskQuestion}
      />
      <FreeTrialSection onStartTrial={handleFreeTrialClick} />
      
      <PlanModal
        isOpen={planModal.isOpen}
        onClose={() => setPlanModal({ isOpen: false })}
        planId={planModal.planId}
        planName={planModal.planName}
        period={planModal.period}
        price={planModal.price}
        isFreeTrial={planModal.isFreeTrial}
      />
    </div>
  )
}

export default page