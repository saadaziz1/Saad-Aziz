import { create } from 'zustand';

interface ProfileState {
    isEditing: boolean;
    activeTab: 'profile' | 'orders' | 'loyalty';
    setIsEditing: (editing: boolean) => void;
    setActiveTab: (tab: 'profile' | 'orders' | 'loyalty') => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
    isEditing: false,
    activeTab: 'profile',
    setIsEditing: (editing) => set({ isEditing: editing }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));