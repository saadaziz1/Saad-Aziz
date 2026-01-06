import { create } from 'zustand';

interface FilterState {
    category: string | null;
    type: string | null;
    minPrice: number;
    maxPrice: number;
    color: string | null;
    size: string | null;
    style: string | null;
    setCategory: (val: string | null) => void;
    setType: (val: string | null) => void;
    setPriceRange: (min: number, max: number) => void;
    setColor: (val: string | null) => void;
    setSize: (val: string | null) => void;
    setStyle: (val: string | null) => void;
    reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    category: null,
    type: null,
    minPrice: 0,
    maxPrice: 500,
    color: null,
    size: null,
    style: null,
    setCategory: (category) => set({ category }),
    setType: (type) => set({ type }),
    setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
    setColor: (color) => set({ color }),
    setSize: (size) => set({ size }),
    setStyle: (style) => set({ style }),
    reset: () => set({ category: null, type: null, minPrice: 0, maxPrice: 500, color: null, size: null, style: null }),
}));
