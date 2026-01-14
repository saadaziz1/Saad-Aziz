'use client';

import React from 'react';
import { Box } from '@mui/material';
import Hero from '@/components/home/Hero';
import FeatureBanner from '@/components/home/FeatureBanner';
import WalletFeatures from '@/components/home/WalletFeatures';
import MarketTrend from '@/components/home/MarketTrend';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <Box>
      <Hero />
      <FeatureBanner />
      <WalletFeatures />
      <MarketTrend />
      <Newsletter />
    </Box>
  );
}
