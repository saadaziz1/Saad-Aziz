import { create } from 'zustand';

interface DashboardState {
    selectedPeriod: 'today' | 'week' | 'month' | 'year';
    setSelectedPeriod: (period: 'today' | 'week' | 'month' | 'year') => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
    selectedPeriod: 'month',
    setSelectedPeriod: (period) => set({ selectedPeriod: period }),
}));