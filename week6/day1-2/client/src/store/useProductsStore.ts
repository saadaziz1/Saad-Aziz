import { create } from 'zustand';

interface ProductsState {
    page: number;
    limit: number;
    search: string;
    category: string;
    type: string;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearch: (search: string) => void;
    setCategory: (category: string) => void;
    setType: (type: string) => void;
}

export const useProductsStore = create<ProductsState>()((set) => ({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    type: '',
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    setSearch: (search) => set({ search, page: 1 }),
    setCategory: (category) => set({ category, page: 1 }),
    setType: (type) => set({ type, page: 1 }),
}));
